---
title: kitex-jwt
categories:
  - SE
  - Go
date: 2024-10-25 11:06:52
tags:
---


在 Kitex 框架下，在 Hertz 服务器上添加 `HertzJWTMiddleware` 中间件对用户进行身份验证 

<!--more-->

### 什么是 `HertzJWTMiddleware`

HertzJWTMiddleware 是一个用于处理 JWT（JSON Web Token）认证的中间件，主要用于保护 API 端点，确保只有经过身份验证的用户才能访问受保护的资源。以下是 HertzJWTMiddleware 中间件的详细介绍，包括其主要方法和功能：  

#### 主要方法和功能 （不完整）

1. LoginHandler： 

   1. 处理用户登录请求。验证用户的登录信息（如用户名和密码），如果验证成功，则生成并返回一个 JWT token

   ```go
   LoginHandler: func(ctx context.Context, c *app.RequestContext) {}
   ```

2. MiddlewareFunc： 

   1. 这是中间件的核心方法，用于在每个请求到达时执行 JWT 验证逻辑。它会从请求中提取 JWT token，并验证其有效性
   2. 确保只有持有有效 JWT Token 的请求才能够访问到受保护的资源

   ```go
   MiddlewareFunc: func(ctx context.Context, c *app.RequestContext) {}
   ```

3. ParseToken： 

   1. 从请求中提取并解析 JWT token。验证 token 的签名和有效期，并提取其中的用户信息

   ```go
   ParseToken: func(ctx context.Context, c *app.RequestContext) (*jwt.Token, error) {}
   ```

4. Unauthorized： 

   1. 定义未授权请求的处理逻辑。当请求未通过 JWT 验证时，会调用此方法返回未授权的响应

   ```go
   Unauthorized: func(ctx context.Context, c *app.RequestContext, code int, message string) {}
   ```

5. PayloadFunc： 

   1. 定义生成 JWT token 时的负载数据。通常用于在 token 中包含用户的身份信息（如用户 ID）

   ```go
   PayloadFunc: func(data interface{}) jwt.MapClaims {}
   ```

6. TokenLookup： 

   1. 配置 token 的查找位置。可以指定从请求头、查询参数或 cookie 中提取 token

   ```go
   TokenLookup: "header: Authorization, query: token, cookie: jwt",
   ```

7. TimeFunc： 

   1. 定义时间函数，用于计算 token 的过期时间

   ```go
   TimeFunc: time.Now
   ```

8. Authenticator： 

   1. 定义用户认证的具体逻辑。通常在用户登录时调用，验证用户的登录信息（如用户名和密码）

   ```go
   Authenticator: func(ctx context.Context, c *app.RequestContext) (interface{}, error) {}
   ```

   

#### 如何去自定义这些方法

在初始化的时候将自定义的方法传递给对应的方法，或者直接在后面进行定义

```go

func main() {
    authMiddleware, err := jwt.New(&jwt.HertzJWTMiddleware{
        Key:           []byte("secret key"),
        PayloadFunc:   customPayloadFunc,   // 这里的后面的都是你自定义的方法
        Unauthorized:  customUnauthorized,
        Authenticator: func(ctx context.Context, c *app.RequestContext) (interface{}, error) {} //直接进行定义
    })
    if err != nil {
        panic(err)
    }

    // 使用自定义的中间件
    h := app.New()
    h.Use(authMiddleware.MiddlewareFunc())
    h.POST("/login", authMiddleware.LoginHandler)
    h.Spin()
}
```



### 身份验证流程

#### Login

1. 在 Hertz 服务器初始化的时候就会同步去初始化所有的用于用户身份验证的 JWT 中间件
2. 用户在登录的时候会触发 JWT 中间件，去调用中间件的 `LoginHandler` 方法，这个方法最后的返回值就是一个 JWT Token
3. `LoginHandler` 在执行的过程中会去调用中间件的 `Authenticator` 方法，在这个方法中对用户的登录账号密码进行验证（自定义）
   1.  `Authenticator` 方法会调用远端的 User 服务进行身份验证（rpc）
   2. 会先去调用 User 远端服务的客户端，客户端再向远端服务端发送请求并且获得具体的响应
4.  `Authenticator` 的返回值（`interface{}` 类型）会传递给 `PayloadFunc` 定义生成 JWT Token 时的负载数据
5. 然后中间件根据初始化时设定的一系列配置和负载数据创建一个 Token 并返回

#### 验证 Token 

1. 在指定的路径 Group 下直接使用上面定义并且初始化好的 `HertzJWTMiddleware` 中间件
2. 当该路径 Group 下一个请求到达的时候，Hertz 服务器会先调用 `MiddlewareFunc` 对请求头中的 Token 进行验证
3. Token 在请求中具体的位置以及格式都需要在上面初始化的时候进行定义
4. 验证通过继续向下传递给对应的 Handler ，验证失败则直接返回

### 用户 Login 过程

#### 初始化中间件

```go
func Init() {
	client.Init() // 初始化 rpc

	// 初始化 user jwt验证 中间件 todo

	model.UserAuthMiddleware, _ = jwt.New(&jwt.HertzJWTMiddleware{
		// 设置用于签名的密钥
		Key: []byte(conf.SecretKey),
		// 设置 token 的过期时间为 1 小时
		Timeout: time.Hour,
		// 设置 token 的最大刷新时间为 1 小时
		MaxRefresh: time.Hour,
		// 定义生成 token 时的负载数据
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if v, ok := data.(int64); ok {
				// 将用户 ID 存储在 token 的负载中
				return jwt.MapClaims{
					conf.IdentityKey: v,
				}
			}

			return jwt.MapClaims{}
		},
		// 定义用户认证逻辑
		Authenticator: func(ctx context.Context, c *app.RequestContext) (interface{}, error) {
			var loginVar model.UserParam
			// 绑定并验证请求中的登录参数
			if err := c.Bind(&loginVar); err != nil {
				return "", jwt.ErrMissingLoginValues
			}

			// 检查用户名和密码是否为空
			if len(loginVar.Phone) == 0 || len(loginVar.PassWord) == 0 {
				return "", jwt.ErrMissingLoginValues
			}

			// 调用 user 客户端方法 这里返回的是用户 Id
			return client.CheckUser(context.Background(), &user.CheckUserReq{Phone: loginVar.Phone, Password: loginVar.PassWord})
		},
		// 定义 token 的查找位置
		TokenLookup: "header: Authorization, query: token, cookie: jwt",
		// 定义 token 的前缀
		TokenHeadName: "Bearer",
		// 定义时间函数
		TimeFunc: time.Now,
	})

	// 初始化 manager jwt验证 中间件 todo

}
```

#### 登陆逻辑

```go

// main.go Hertz
func main(){
  Init() 
  userGroup := h.Group("/user")
  userGroup.POST("/login", handler_user.Login)
}

// handler_user/login.go
func Login(ctx context.Context, c *app.RequestContext) {
	model.UserAuthMiddleware.LoginHandler(ctx, c)
}

```

#### client 客户端

```go
func CheckUser(ctx context.Context, req *user.CheckUserReq) (int32, error) {
	resp, err := userClient.CheckUser(ctx, req)
	if err != nil {
		return 0, err
	}
	if resp.BaseResp.StatusCode != 0 {
		return 0, errno.NewErrNo(int64(resp.BaseResp.StatusCode), resp.BaseResp.StatusMessage)
	}
	return resp.UserId, nil

}

```



#### user 服务端

```go
// rpc/user/handler.go
func (s *UserServiceImpl) CheckUser(ctx context.Context, req *user.CheckUserReq) (r *user.CheckUserResp, err error) {
	resp := user.NewCheckUserResp()
	id ,err := service.NewUserService(ctx).CheckUser(req)
	if err != nil {
		resp.BaseResp = errno.BuildBaseResp(err)
		return resp, nil
	}
	// 成功返回
	resp.UserId = id
	resp.BaseResp = errno.BuildBaseResp(errno.Success)
	return resp, nil

}
// service/login.go
func (s *UserService) CheckUser(req *user.CheckUserReq) (int32, error) {
	h := md5.New()
	if _, err := io.WriteString(h, req.Password); err != nil {
		return 0, err
	}
	userPhone := req.Phone
	users, err := db.QueryUser(s.ctx, userPhone)
	if err != nil {
		return 0, err
	}
	if len(users) == 0 {
		return 0, errno.UserNotExistErr
	}

	u := users[0]
	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(req.Password)) //验证密码是否正确

	if err != nil {
		return 0, errno.LoginErr
	}
	return int32(u.ID), nil
}
```



### 其他用户请求处理

```go
	// manager service
	managerGroup := h.Group("/manager") 
	managerGroup.Use(model.UserAuthMiddleware.MiddlewareFunc()) // 对某个路径组应用中间件进行验证
```

