---
title: kitex-error
categories:
  - SE
  - Go
date: 2024-10-23 16:24:27
tags:
---


关于 Kitex 项目中的错误处理（框架）

<!--more-->

## Kitex 中 error 处理

先在 pkg/errno 目录下定义出项目所需要的错误类型（错误码 + 错误信息）实现一些必要的 api(创建、输出、错误信息添加)

继续在 pkg/errno 目录下定义出将 error 转化为 BaseResp(基本响应类型)的代码 过程为 error -> errno(自定义的) ->baseResp 

### Go 中的 error

在 Go 语言中，error 是一个内置的接口类型，用于表示错误。它的定义如下：

```go
type error interface {
    Error() string
}
```

所以只需要实现了 Error 方法，该结构体就可以作为 error 接口类型的一个实现

### `errno` 错误(码)类型自定义

```go
// pkg/errno/errno.go
package errno

import (
	"errors"
	"fmt"
)

const (
	// System Code
	SuccessCode    = 0
	ServiceErrCode = 10001
	ParamErrCode   = 10002

	// User ErrCode
	LoginErrCode            = 11001
	UserNotExistErrCode     = 11002
	UserAlreadyExistErrCode = 11003
)

// ErrNo 错误信息结构体
type ErrNo struct {
	ErrCode int64
	ErrMsg  string
}

// 输出错误信息 
func (e ErrNo) Error() string {
	return fmt.Sprintf("err_code=%d, err_msg=%s", e.ErrCode, e.ErrMsg)
}

// NewErrNo 创建一个新的错误信息
func NewErrNo(code int64, msg string) ErrNo {
	return ErrNo{code, msg}
}

// AddErrMsg 给错误信息添加错误信息
func (e ErrNo) WithMessage(msg string) ErrNo {
	e.ErrMsg = msg
	return e
}

var (
	Success             = NewErrNo(SuccessCode, "Success")
	ServiceErr          = NewErrNo(ServiceErrCode, "Service is unable to start successfully")
	ParamErr            = NewErrNo(ParamErrCode, "Wrong Parameter has been given")
	LoginErr            = NewErrNo(LoginErrCode, "Wrong username or password")
	UserNotExistErr     = NewErrNo(UserNotExistErrCode, "User does not exists")
	UserAlreadyExistErr = NewErrNo(UserAlreadyExistErrCode, "User already exists")
)

// 将一个 error 类型的错误转换为自定义的 ErrNo 类型
// ConvertErr convert error to Errno
func ConvertErr(err error) ErrNo {
	Err := ErrNo{}
	if errors.As(err, &Err) {
		return Err
	}

	s := ServiceErr
	s.ErrMsg = err.Error()
	return s
}

```

### 从 `error` 构建 `baseResp`

注意 `BuildBaseResp(err error)` 使用 error 这种接口类型作为参数

我们实现的 ErrN0 结构体作为 error (接口) 类型的一个实现，同样也可以作为参数进行传递

```go
// pkg/errno/resp.go
package errno

import (
	"errors"
	"git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/kitex_gen/base"
)


// BuildBaseResp 从 error 构建 baseResp  先将 error -> Errno(自定义的)
func BuildBaseResp(err error) *base.BaseResp {
	// 如果错误为 nil，返回表示成功的 baseResp
	if err == nil {
		return baseResp(Success)
	}

	// 创建一个空的 ErrNo 结构体
	e := ErrNo{}
	// 检查传入的错误是否可以转换为 ErrNo 类型，如果可以则返回对应的 baseResp
	if errors.As(err, &e) {
		return baseResp(e)
	}

	// 如果不能转换，则创建一个新的 ServiceErr，并将错误信息附加到 ErrMsg 字段，返回对应的 baseResp
	s := ServiceErr.WithMessage(err.Error())
	return baseResp(s)
}

// baseResp 将 ErrNo 转换为 base.BaseResp
func baseResp(err ErrNo) *base.BaseResp {
	// 返回一个新的 base.BaseResp，包含错误码和错误信息
	return &base.BaseResp{StatusCode: int32(err.ErrCode), StatusMessage: err.ErrMsg}
}

```



### 使用定义好的错误类型抛出错误

```go
func (s *UserServiceImpl) CreateUser(ctx context.Context, req *user.CreateUserReq) (resp *user.CreateUserResp, err error) {
	// TODO: Your code here...
	resp = user.NewCreateUserResp()

	err = service.NewUserService(ctx).CreateUser(req)
	if err != nil {
		resp.BaseResp = errno.BuildBaseResp(err)  //通过 error 构建出 baseresp 返回 
		return resp, nil
	}
	// 成功返回
	resp.BaseResp = errno.BuildBaseResp(errno.Success)  //通过errno中定义的Success直接构建 resp返回 
	return resp, nil
}
```

