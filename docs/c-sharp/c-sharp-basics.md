# C# Tech Stack

Brief, practical tech stack and examples for modern C#/.NET projects (aligned with CONTRIBUTING.md style).

## What is this tech stack?
A concise set of SDKs, frameworks, tools and practices for building cross-platform .NET applications: web, APIs, libraries, and CLI tools.

## Core Components
- Runtime / SDK
  - .NET SDK (dotnet 6, 7, 8+)
- Frameworks
  - ASP.NET Core, MAUI, Blazor
- Build & tooling
  - dotnet CLI, MSBuild
- Package manager
  - NuGet
- Testing
  - xUnit, NUnit, MSTest
- Formatting & linting
  - dotnet format, StyleCop.Analyzers, EditorConfig
- Debugging & profiling
  - Visual Studio debugger, dotnet-trace, dotnet-counters, JetBrains dotTrace
- Static analysis
  - Roslyn analyzers, SonarQube
- CI/CD
  - GitHub Actions, Azure Pipelines, GitLab CI
- IDEs
  - Visual Studio, VS Code (C# extension), Rider

## Basic Example

Program.cs
```csharp
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, .NET!");
    }
}
```
Expected output:
```
Hello, .NET!
```

## Minimal .csproj
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
```

## Example unit test (xUnit)
```csharp
// tests/CalculatorTests.cs
using Xunit;

public class Calculator {
    public int Add(int a,int b) => a + b;
}

public class CalculatorTests {
    [Fact]
    public void Add_Works() {
        var c = new Calculator();
        Assert.Equal(5, c.Add(2,3));
    }
}
```

## CI snippet (GitHub Actions)
```yaml
name: .NET CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore
      - run: dotnet build --configuration Release --no-restore
      - run: dotnet test --no-build --verbosity normal
```

## File organization
```
project/
├─ src/
│  └─ ProjectName/
│     ├─ Program.cs
│     └─ ProjectName.csproj
├─ tests/
│  └─ ProjectName.Tests/
├─ .github/workflows/
└─ README.md
```

## Common Pitfalls
- Mixing target frameworks or incompatible package versions
- Ignoring nullable reference warnings
- Heavy synchronous I/O on ASP.NET threads
- Leaking DI scopes or disposing shared services

## Best Practices
- Prefer async/await for I/O
- Use DI and small services
- Enable analyzers and treat warnings as errors in CI
- Pin package versions for libraries
- Write unit and integration tests; run them in CI

## Related Topics
- ASP.NET Core Docs — https://learn.microsoft.com/aspnet/core
- .NET API Browser — https://learn.microsoft.com/dotnet/api

## References
- https://dotnet.microsoft.com
- xUnit: https://xunit.net
