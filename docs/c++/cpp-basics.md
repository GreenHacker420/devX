// ...existing code...
# C++ Tech Stack

Brief, practical tech stack and examples for modern C++ projects (aligned with CONTRIBUTING.md style).

## What is this tech stack?
A curated set of compilers, build tools, libraries, testing and CI tools commonly used for developing reliable, cross-platform C++ applications and libraries.

## Core Components

- Compilers
  - GCC (g++)
  - Clang (clang++)
  - MSVC (cl.exe) — Windows
- Build systems
  - CMake (recommended)
  - Meson, Bazel (alternatives)
- Package managers
  - Conan, vcpkg
- Testing
  - Catch2, GoogleTest
- Formatting & linting
  - clang-format, clang-tidy
- Debugging & profiling
  - gdb, lldb, Visual Studio Debugger, valgrind, perf
- Static analysis
  - cppcheck, clang-tidy, clang-analyzer
- CI/CD
  - GitHub Actions, GitLab CI, Azure Pipelines
- IDEs & Editors
  - Visual Studio Code (with C/C++ extension), CLion, Visual Studio, Qt Creator

## Basic Example

Hello world (file: src/main.cpp)
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++ tech stack!\n";
    return 0;
}
```
Expected output:
```
Hello, C++ tech stack!
```

## Minimal CMakeLists.txt
```cmake
cmake_minimum_required(VERSION 3.16)
project(hello_cpp LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
add_executable(hello src/main.cpp)
```

## Example unit test (Catch2)
```cpp
// tests/test_example.cpp
#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

int add(int a, int b) { return a + b; }

TEST_CASE("addition works") {
    REQUIRE(add(2,3) == 5);
}
```

## CI snippet (GitHub Actions - build & test)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        compiler: [gcc, clang]
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: sudo apt-get update && sudo apt-get install -y build-essential cmake
      - name: Configure
        run: cmake -S . -B build
      - name: Build
        run: cmake --build build --config Release
      - name: Test
        run: ctest --test-dir build --output-on-failure
```

## File organization
```
project/
├─ src/
│  └─ main.cpp
├─ include/
│  └─ project/
├─ tests/
│  └─ test_example.cpp
├─ CMakeLists.txt
└─ .github/workflows/ci.yml
```

## Common Pitfalls
- Undefined behavior (use sanitizers: -fsanitize=address,undefined,leak)
- Mixing ABIs or incompatible compiler flags
- Missing header guards / pragma once issues
- Manual memory mistakes — prefer smart pointers and RAII

## Best Practices
- Use modern C++ (RAII, smart pointers, move semantics, constexpr, spans)
- Keep headers minimal; prefer pimpl or modules for large projects
- Enforce style with clang-format and checks in CI
- Write unit tests and run sanitizers in CI
- Use CMake modern targets and interface libraries (target_include_directories / target_compile_features)

## Related Topics
- C++ core guidelines — https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- CMake documentation — https://cmake.org/documentation/
- Conan — https://conan.io
- Catch2 — https://github.com/catchorg/Catch2

## References
- cppreference: https://en.cppreference.com
- Sanitizers & Undefined Behavior: https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html
