---
title: MyBatis
categories:
  - SE
  - SpringBoot
abbrlink: 1bff3c65
date: 2024-09-03 14:15:38
tags:
---

什么是 `MyBatis` ，以及如何在 `SpringBoot` 中使用 `Mybatis`

<!--more-->

## MyBatis

### 什么是 `MyBatis`

MyBatis是一个优秀的持久层框架，它支持定制化SQL、存储过程以及高级映射。MyBatis消除了几乎所有的JDBC代码和参数的手动设置以及结果集的检索。MyBatis可以使用简单的XML或注解进行配置，并将原生信息映射成数据库记录。 

### `MyBatis` 的主要作用

- 将SQL查询语句与Java代码分离，提高代码的可读性和可维护性。
- 提供SQL语句的动态生成，方便进行复杂查询。
- 提供映射关系配置，自动将SQL查询结果映射为Java对象

### `MyBatis` 的组成部分

#### *Mapper .class

 `*Mapper.class` 是一个**==接口== **，它定义了一些方法，这些方法对应于数据库操作，如查询、插入、更新和删除。这些方法的名称和参数将被用来生成SQL语句

例如：

```java
public interface UserMapper {
    List<User> getAllUsers();
    User getUserById(int id);
    List<User> getUsersByName(String name);
}
```

#### *Mapper.xml

`*Mapper.xml` 文件是一个 `XML` 文件，它提供了 `*Mapper.class` 接口方法和 `SQL` 语句之间的映射。在这个文件中，你可以定义 `SQL` 语句，以及如何将结果集映射到 `Java` 对象。  

例如，你可能有一个 `UserMapper.xml` 文件，如下所示

```xml
<mapper namespace="com.wcx.blog.BlogBackend.mapper.UserMapper">
    <select id="getAllUsers" resultType="com.wcx.blog.BlogBackend.po.User">
        SELECT * FROM user
    </select>

    <select id="getUserById" parameterType="int" resultType="com.wcx.blog.BlogBackend.po.User">
        SELECT * FROM user WHERE id = #{id}
    </select>

    <select id="getUsersByName" parameterType="string" resultType="com.wcx.blog.BlogBackend.po.User">
        SELECT * FROM user WHERE name = #{name}
    </select>
</mapper>
```

`<select>`元素的id属性对应于UserMapper接口中的方法名

resultType属性指定了结果集应该映射到哪个Java类（实体类）

SQL语句则定义在 `<select>` 元素的文本内容中。  

## `MyBatis` 的应用

#### 动态 `SQL`

动态 `sql` ：根据不同的条件和情况，在运行时生成或修改的SQL语句。

传递一个 `map` 类型的参数：

```java
Map<String, Object> params = new HashMap<>();
params.put("username", "wcx0206");
params.put("email", "wcx0206@example.com");
// Mapper.class 接口
@Mapper
public interface UserMapper {
    List<User> getAllUsers();
    List<User> getUsersByCondition(Map<String, Object> params);
}
```



```xml
#  Mapper.xml 映射文件 根据参数params中的值选择sql语句或者添加条件
<mapper namespace="com.wcx.blog.BlogBackend.mapper.UserMapper">
    <!-- 其他的<select>元素 -->

    <select id="getUsersByCondition" parameterType="map"  resultType="com.wcx.blog.BlogBackend.po.User">
        SELECT * FROM user
        <where>
            <if test="params.name != null">
                AND name = #{params.name}
            </if>
            <if test="params.email != null">
                AND email = #{params.email}
            </if>
        </where>
    </select>
</mapper>
```



#### 结果映射

1. 将 resultType的值设定为一个自定义的实体类
2. MyBatis会将查询结果自动映射成为这个实体类的对象

```xml
    <select id="getUsersByCondition" parameterType="map"  resultType="com.wcx.blog.BlogBackend.po.User">
```



### `MyBatis`配置文件

application配置文件

```yml
# 通过在application.yml文件中设置mybatis.mapper-locations属性来指定MyBatis的XML映射文件的位置。  
# 如果XML映射文件位于src/main/resources/mapper目录下，在application.yml文件中添加以下配置：

mybatis:
  mapper-locations: 
  type-aliases-package: com.wcx.blog.BlogBackend.po # 示例类位置
  configuration:
    map-underscore-to-camel-case: true
```

主类配置

```java
@SpringBootApplication
@EnableAspectJAutoProxy
@MapperScan("com.wcx.blog.BlogBackend.mapper") // 添加扫描mapper
public class BlogBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogBackendApplication.class, args);
	}

}
```

