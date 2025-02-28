---
title: aliyunOss
tags:
 - SE
 - SpringBoot
date: 2024-10-23 21:02:46
---


Spring Boot 结合 Aliyun Oss 实现图片等的上传

<!--more-->

### 配置

获取所需的依赖包

```xml
# pom.yml
		<dependency>
			<groupId>com.aliyun.oss</groupId>
			<artifactId>aliyun-sdk-oss</artifactId>
			<version>3.15.1</version>
		</dependency>
```

在 applicaion 中配置一些 `Oss` 必要的环境变量

```yml
# application.ym/
aliyun:
  oss:
    endpoint: oss-cn-nanjing.aliyuncs.com
    accessKeyId: LTAI5t99f26ZT
    accessKeySecret: ZlUQ
    bucketName: wcx0206
```



### Oss 工具类的实现

```java
@Component
@Getter
@Setter
@NoArgsConstructor
@ConfigurationProperties("aliyun.oss") // 从 application 中读取配置
public class OssUtil {
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;

    public String upload(String objectName, InputStream inputStream) {
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName, inputStream);
        try {
            ossClient.putObject(putObjectRequest);
        }finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
        return ossClient.generatePresignedUrl(bucketName, objectName, new Date()).toString().split("\\?Expires")[0];
    }
}
```

### 工具类的使用

#### Service

```java
    @Override
    public String uploadImage(MultipartFile file) {
        try {
            return ossUtil.upload(file.getOriginalFilename(), file.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
```

#### Controller 

```java
    @RequestMapping("/upload")
    @Operation(summary = "上传图片", description = "上传图片的接口")
    public ResultVO<String> uploadImage(
            @Parameter(name = "file", description = "图片文件", required = true) @RequestParam MultipartFile file
    ) {
        return ResultVO.buildSuccess(imageService.uploadImage(file));
    }
```

