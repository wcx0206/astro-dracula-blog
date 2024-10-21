---
title: Useful packages in Java
toc: true
tags:
  - Java
categories:
  - CS
  - Languages
  - Java
abbrlink: a4746c9
date: 2023-03-15 22:46:17
---

A simple conclusion of some useful packages in java.

<!--more-->

## [java.io](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/package-summary.html)

### Classification by type of stream

#### Stream of characters

##### Reader

- [BufferedReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedReader.html)
- [InputStreamReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/InputStreamReader.html)
  - [FileReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileReader.html)
- [StringReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/StringReader.html)
- [PipedReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedReader.html)
- [CharArrayReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/CharArrayReader.html)
- [FilterReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FilterReader.html)
  - [PushbackReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PushbackReader.html)

##### Writer

- [BufferedWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedWriter.html)
- [OutputStreamWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/OutputStreamWriter.html)
  - [FileWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileWriter.html)
- [PrinterWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PrintWriter.html)
- [StringWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/StringWriter.html)
- [PipedWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedWriter.html)
- [CharArrayWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/CharArrayWriter.html)
- [FilterWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FilterWriter.html)

#### Stream of bytes

##### InputStream

- [FileInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileInputStream.html)
- [FilterInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FilterInputStream.html)
  - [BufferedInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedInputStream.html)
  - [DataInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/DataInputStream.html)
  - [PushbackInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PushbackInputStream.html)
- [ObjectInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ObjectInputStream.html)
- [PipedInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedInputStream.html)
- [SequenceInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/SequenceInputStream.html)
- [StringBufferInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/StringBufferInputStream.html)
- [ByteArrayInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ByteArrayInputStream.html)

##### OutputStream

- [FileOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileOutputStream.html)
- [FilterOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FilterOutputStream.html)
  - [BufferedOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedOutputStream.html)
  - [DataOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/DataOutputStream.html)
  - [PrintStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PrintStream.html)
- [ObjectOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ObjectOutputStream.html)
- [PipedOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedOutputStream.html)
- [ByteArrayOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ByteArrayOutputStream.html)

### Classification by operation object

#### File

- [FileReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileReader.html)
- [FileWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileWriter.html)
- [FileInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileInputStream.html)
- [FileOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/FileOutputStream.html)

#### Array

##### ByteArray

- [ByteArrayInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ByteArrayInputStream.html)
- [ByteArrayOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ByteArrayOutputStream.html)

##### CharArray

- [CharArrayReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/CharArrayReader.html)
- [CharArrayWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/CharArrayWriter.html)

#### Pipe

- [PipedReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedReader.html)
- [PipedWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedWriter.html)
- [PipedInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedInputStream.html)
- [PipedOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PipedOutputStream.html)

#### Data (basic data types)

- [DataInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/DataInputStream.html)
- [DataOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/DataOutputStream.html)

#### Buffer

- [BufferedReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedReader.html)
- [BufferedWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedWriter.html)
- [BufferedInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedInputStream.html)
- [BufferedOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/BufferedOutputStream.html)

#### Print

- [PrinterWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PrintWriter.html)
- [PrintStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/PrintStream.html)

#### Object serialization

- [ObjectInputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ObjectInputStream.html)
- [ObjectOutputStream](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/ObjectOutputStream.html)

#### Stream transformation

- [InputStreamReader](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/InputStreamReader.html)
- [OutputStreamWriter](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/OutputStreamWriter.html)

## [java.lang](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/package-summary.html)

### System

#### Process

- [Process](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Process.html)
- [ProcessBuilder](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ProcessBuilder.html)

#### Thread

- [Thread](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Thread.html)
- [ThreadGroup](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ThreadGroup.html)
- [ThreadDeath](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ThreadDeath.html)
- [ThreadLocal](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ThreadLocal.html)

#### Run

- [Runnable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Runnable.html)
- [Runtime](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/runtime/package-summary.html)
- [RuntimePermission](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/RuntimePermission.html)
- [System](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/System.html)

#### Stack

- [StackTraceElement](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/StackTraceElement.html)

#### Exception - [Throwable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Throwable.html)

##### Error

- [NoClassDefFoundError](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NoClassDefFoundError.html)
- [NoSuchFieldError](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NoSuchFieldError.html)
- [OutOfMemoryError](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/OutOfMemoryError.html)
- [NoSuchMethodError](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NoSuchMethodError.html)

##### Exception

- [ArrayIndexOutOfBoundsException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ArrayIndexOutOfBoundsException.html)
- [ClassCastException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ClassCastException.html)
- [ClassNotFoundException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/ClassNotFoundException.html)
- [IllegalArgumentException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/IllegalArgumentException.html)
- [IndexOutOfBoundsException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/IndexOutOfBoundsException.html)
- [NoSuchFieldException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NoSuchFieldError.html)
- [NoSuchMethodException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NoSuchMethodError.html)
- [NullPointerException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NullPointerException.html)
- [NumberFormatException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/NumberFormatException.html)
- [RuntimeException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/RuntimeException.html)
- [InterruptedException](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/InterruptedException.html)

### Annotation

java.lang

- [Deprecated](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Deprecated.html)
- [FunctionalInterface](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/FunctionalInterface.html)
- [Override](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Override.html)
- [SafeVarargs](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/SafeVarargs.html)
- [SuppressWarnings](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/SuppressWarnings.html)

java.lang.annotation

- [Documented](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/Documented.html)
- [Inherited](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/Inherited.html)
- [Native](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/Native.html)
- [Repeatable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/Repeatable.html)
- [Retention](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/Retention.html)
- [Target](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/Target.html)

### Interface

java.lang

- [AutoCloseable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/AutoCloseable.html)
- [Annotation](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/annotation/package-summary.html)
- [CharSequence](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/CharSequence.html)
- [Cloneable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Cloneable.html)
- [Comparable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Comparable.html)
- [Iterable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Iterable.html)
- [Readable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Readable.html)
- [Runnable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Runnable.html)

java.lang.reflect

- [InvocationHandler](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/InvocationHandler.html)
- [GenericDeclaration](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/GenericDeclaration.html)
- [AnnotatedElement](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/AnnotatedElement.html)
- [Member](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Member.html)

### Type

#### Basic type

- [Boolean](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Boolean.html)
- [Character](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Character.html)
- [String](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/String.html)
- [Number](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Number.html)
  - [Byte](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Byte.html)
  - [Short](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Short.html)
  - [Integer](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Integer.html)
  - [Long](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Long.html)
  - [Float](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Float.html)
  - [Double](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Double.html)

#### Class

- [Class](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Class.html)

#### Package

- [Package](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Package.html)

#### Other

- [Object](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Object.html)
- [Enum](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Enum.html)
- [Void](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Void.html)

### Tool class

#### Character serial

- [StringBuffer](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/StringBuffer.html)
- [StringBuilder](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/StringBuilder.html)

#### Math

- [java.lang.Math](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Math.html)

NOTICE: not java.math

### Reflection

java.lang.reflect

- [Array](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Array.html)
- [Constructor](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Constructor.html)
- [Field](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Field.html)
- [Method](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Method.html)
- [Proxy](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Proxy.html)
- [Executable](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/Executable.html)
- [AccessibleObject](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/reflect/AccessibleObject.html)

## java.math

NOTICE: not java.lang.Math

- [BigDecimal](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/math/BigDecimal.html)
- [BigInteger](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/math/BigInteger.html)
- [MathContext](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/math/MathContext.html)
- [RoundingMode](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/math/RoundingMode.html)

## To be continued

java.net
