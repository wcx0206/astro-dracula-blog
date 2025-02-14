---
title: kitex-test
tags:
---

Go Kitex 框架下如何进行测试

<!--more-->

### Mock 插桩

如何结合 go mock 来 mock 一个 client 作为桩对象

#### 安装 go mock

```shell
go install go.uber.org/mock/mockgen@latest
```

#### 生成 Kitex mock 框架代码

- -source：使用 kitex 生成的框架代码中的 `client.go`，一般位于 `xxxservice` 目录下

  ![image-20241113152850314](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241113152850314.png)

- -destination：生成的 mock 框架代码的位置

- -package：生成的 mock 框架代码所在位置的包名

```shell
mockgen -source=kitex_gen/xxxx/xxxservice/client.go -destination=xxx/client_mock.go -package=xxx
```

运行上面的命令会在 `destination` 位置生成一个 `client_mock.go` 框架代码文件，可以使用里面的代码进行 mock 插桩

### 生成的框架代码的解析

#### mock 需要的一些 Struct 结构

```go
// MockClient 是 Client 接口的 mock 实现。
type MockClient struct {
    // ctrl 是 gomock 控制器，用于管理 mock 的生命周期和行为。
    ctrl     *gomock.Controller
    // recorder 是 MockClient 的 mock 记录器，用于记录和验证期望的调用。
    recorder *MockClientMockRecorder
    // isgomock 是一个空的结构体，用于标识这是一个 gomock 生成的 mock 对象。
    isgomock struct{}
}

// MockClientMockRecorder 是 MockClient 的 mock 记录器。
type MockClientMockRecorder struct {
    // mock 是指向 MockClient 的指针，用于记录和验证期望的调用。
    mock *MockClient
}

// NewMockClient 创建一个新的 mock 实例。所以创建 mockClient时需要传入一个 ctrl gomock 控制器
func NewMockClient(ctrl *gomock.Controller) *MockClient {
    // 创建一个新的 MockClient 实例，并初始化 ctrl 和 recorder 字段。
    mock := &MockClient{ctrl: ctrl}
    mock.recorder = &MockClientMockRecorder{mock}
    // 返回创建的 MockClient 实例。
    return mock
}

// EXPECT 返回一个对象，允许调用者指示预期的使用。
func (m *MockClient) EXPECT() *MockClientMockRecorder {
    // 返回 recorder 字段，用于记录和验证期望的调用。
    return m.recorder
}
```



#### 方法调用模拟函数

这个函数是  `MockClient` 的方法，可以使用 `MockClient` 进行调用，模拟函数的调用过程

函数的关键是：

1. 处理传递过来的参数
2. 调用 gomock 控制器的 Call 方法，模拟 CreateUser 方法的调用。 gomock 控制器的 Call 方法回去调用自定义的方法并返回
3. 返回这个模拟调用的方法

```go
// CreateUser mocks base method.
// CreateUser 模拟基础方法。
func (m *MockClient) CreateUser(ctx context.Context, req *user.CreateUserReq, callOptions ...callopt.Option) (*user.CreateUserResp, error) {
    // m.ctrl.T.Helper() 标记此函数为帮助函数，以便在测试失败时报告调用者的行号，而不是此帮助函数的行号。
    m.ctrl.T.Helper()
    
    // varargs := []any{ctx, req} 将传递来的上下文和请求参数放入一个切片。
    varargs := []any{ctx, req}
    
    // for _, a := range callOptions { varargs = append(varargs, a) } 将所有可选的调用参数追加到 varargs 切片中。
    for _, a := range callOptions {
        varargs = append(varargs, a)
    }
    
    // ret := m.ctrl.Call(m, "CreateUser", varargs...) 调用 gomock 控制器的 Call 方法，模拟 CreateUser 方法的调用。
    ret := m.ctrl.Call(m, "CreateUser", varargs...)
    
    // ret0, _ := ret[0].(*user.CreateUserResp) 将返回值的第一个元素转换为 *user.CreateUserResp 类型。
    ret0, _ := ret[0].(*user.CreateUserResp)
    
    // ret1, _ := ret[1].(error) 将返回值的第二个元素转换为 error 类型。
    ret1, _ := ret[1].(error)
    
    // return ret0, ret1 返回模拟的 CreateUser 方法的结果。
    return ret0, ret1
}
```



#### mock 方法调用记录函数

这个函数的主要作用是去记录 mockClient 的调用函数

一般记录函数 `CreateUser` 会被间接调用。具体来说，当你调用 `client.EXPECT().CreateUser(...)` 时，实际上是调用了 `MockClientMockRecorder` 结构体中的 `CreateUser` 方法，这个方法负责记录对 `CreateUser` 方法的预期调用。

```go
// 设置预期调用
client.EXPECT().CreateUser(gomock.Any(), gomock.Any(), gomock.Any()).DoAndReturn(MockCreateUser).AnyTimes()
```

这行代码中，`client.EXPECT()` 返回 `MockClientMockRecorder` 的实例，然后调用 `CreateUser` 方法，这个方法会记录对 `CreateUser` 方法的预期调用。具体来说，`MockClientMockRecorder` 结构体中的 `CreateUser` 方法会调用 `RecordCallWithMethodType` 来记录调用信息

```go

// CreateUser 表示预期的 CreateUser 调用。
func (mr *MockClientMockRecorder) CreateUser(ctx, req any, callOptions ...any) *gomock.Call {
    // mr.mock.ctrl.T.Helper() 标记此函数为帮助函数，以便在测试失败时报告调用者的行号，而不是此帮助函数的行号。
    mr.mock.ctrl.T.Helper()
    
    // varargs := append([]any{ctx, req}, callOptions...) 将传入的上下文、请求参数和所有可选的调用参数放入一个切片中。
    varargs := append([]any{ctx, req}, callOptions...)
    
    // 调用 gomock 控制器的 RecordCallWithMethodType 方法，记录 CreateUser 方法的调用，并返回一个 *gomock.Call 对象。
    return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateUser", reflect.TypeOf((*MockClient)(nil).CreateUser), varargs...)
}
```



### 使用框架代码进行测试

#### 测试文件的格式要求

编写 Test 逻辑的文件名一定要以 `_test` 结尾，只有这样在后续运行的时候才会被 Go 识别并且运行测试

#### 具体的使用逻辑

- 先实现一个你想要去 mock 的方法，然后在测试文件中使用 `gomock` 控制器去创建一个 `MockClient` 实例，然后添加 mock 函数，最后发起 mock call
- 一般这个 mock 方法就是返回一个你通过函数调用后预期想要得到的一个结果
- 当然你也不一定需要显式的去定义一个 mock 函数，你可以在 `DoAndReturn` 方法中直接定义一个匿名函数，这个匿名函数就是你想要的 mock 函数
- 整个过程中，mockClient 回去调用你定义的 mock 函数，然后返回结果。通过比较返回的结果和你预期的结果，来判断测试是否通过

```go

// MockHello 实现你想要的 mock 方法
func MockCreateUser(ctx context.Context, req *user.CreateUserReq, callOptions ...callopt.Option) (*user.CreateUserResp, error) {
	// 我在这里调用了我在 user_service.go 中定义的函数 去模拟一个真实的调用
	userService := NewUserService(context.Background())
	db.Init()
	err := userService.CreateUser(req)
	if err != nil {
		return &user.CreateUserResp{
			BaseResp: errno.BuildBaseResp(err),
		}, nil
	}
	return &user.CreateUserResp{
		BaseResp: errno.BuildBaseResp(errno.Success),
	}, nil
}

// TestClient 测试 mock 函数
func TestClient(t *testing.T) {

    // 创建一个 gomock 控制器
	ctrl := gomock.NewController(t)
    // 延迟关闭控制器
	defer ctrl.Finish()

	// 获取 go mock 生成的 client
	client := mock.NewMockClient(ctrl)
	// 添加 mock 函数 将 CreateUser 方法的调用模拟为 你上面的定义的 MockCreateUser 函数
	client.EXPECT().CreateUser(gomock.Any(), gomock.Any(), gomock.Any()).DoAndReturn(MockCreateUser).AnyTimes()

	// 通过 mockClient 发起 mock call 进行调用
	resp, err := client.CreateUser(context.Background(), &user.CreateUserReq{
		&user.User{
			Name:     "test",
			Phone:    "12345678901",
			Password: "test",
		},
	})

	if err == nil {
		fmt.Println(resp.BaseResp.StatusMessage)
	} else {
		fmt.Println(err)
	}
    // 断言 判断是否符合预期
    assert.Equal(t, int32(errno.Success.ErrCode), int32(resp.BaseResp.StatusCode))
}

```

#### 运行测试

需要在测试文件（*`_test.go`）所在的目录下 运行下面的命令

```bash
go test -v # -v表示详细模式 会输出细节
```

#### 运行结果

![image-20241113170617455](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241113170617455.png)
