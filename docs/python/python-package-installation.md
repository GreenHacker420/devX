# 🐍 Python Package Installation & Usage Guide

This guide explains how to install and use different Python packages using common tools like `pip` and `conda`.

---

## 📦 Installing Packages with pip

`pip` is the standard package manager for Python.

### Install a Package
```bash
pip install package_name
```

### Install a Specific Version
```bash
pip install package_name==1.2.3
```

### Upgrade a Package
```bash
pip install --upgrade package_name
```

### Install from a requirements file
```bash
pip install -r requirements.txt
```

---

## 🐍 Using Installed Packages

After installation, import and use the package in your Python code:

```python
import package_name
# Example usage
data = package_name.some_function()
```

---

## 📦 Installing Packages with conda

If you use Anaconda or Miniconda, use `conda`:

### Install a Package
```bash
conda install package_name
```

### Create Environment and Install
```bash
conda create -n myenv package_name
conda activate myenv
```

---

## 💡 Tips & Best Practices
- Use virtual environments (`venv`, `virtualenv`, or `conda`) to manage dependencies.
- Keep dependencies in `requirements.txt` or `environment.yml` for reproducibility.
- Use `pip list` or `conda list` to see installed packages.
- Use `pip uninstall package_name` or `conda remove package_name` to remove packages.

---

## 📚 Further Reading
- [pip documentation](https://pip.pypa.io/en/stable/)
- [conda documentation](https://docs.conda.io/en/latest/)
- [Python Packaging User Guide](https://packaging.python.org/)

---

MIT License © devdocx contributors
