# Tutorial de Git y GitHub - Conceptos Básicos

## 📚 ¿Qué es Git?

Git es un sistema de control de versiones que te permite guardar el historial de cambios de tus archivos.

## 🌳 Repositorio

Un **repositorio** (o "repo") es como una carpeta especial que contiene:
- Tus archivos de proyecto
- El historial de todos los cambios que has hecho
- Información sobre quién hizo cada cambio y cuándo

### Tipos de repositorios:
- **Repositorio local**: La copia en tu computadora
- **Repositorio remoto**: La copia en GitHub (en la nube)

## 🌿 Ramas (Branches)

Las **ramas** son versiones paralelas de tu proyecto.

```
main (rama principal)
  |
  |-- commit 1
  |-- commit 2
  |
  |--- nueva-rama (rama secundaria)
        |-- commit 3
        |-- commit 4
```

### ¿Por qué usar ramas?
- Para trabajar en nuevas características sin afectar el código principal
- Para experimentar de forma segura
- Para colaborar con otros sin conflictos

### Comandos básicos:
```bash
# Ver todas las ramas
git branch

# Crear una nueva rama
git branch nombre-de-rama

# Cambiar a otra rama
git checkout nombre-de-rama

# Crear y cambiar a una nueva rama
git checkout -b nombre-de-rama
```

## 💾 Commits

Un **commit** es como una "fotografía" de tus archivos en un momento específico.

### El proceso de hacer un commit:

1. **Hacer cambios**: Modificas, creas o eliminas archivos
2. **Stage (preparar)**: Dices qué cambios quieres guardar
3. **Commit**: Guardas los cambios con un mensaje

```bash
# Ver qué archivos cambiaron
git status

# Preparar un archivo específico
git add archivo.txt

# Preparar todos los archivos
git add .

# Hacer el commit con mensaje
git commit -m "Descripción de lo que hice"
```

### ¿Dónde están los commits?

Los commits están en el **historial de Git**, guardados en la carpeta oculta `.git/`

```bash
# Ver historial de commits
git log

# Ver historial resumido
git log --oneline

# Ver los últimos 5 commits
git log --oneline -5
```

Cada commit tiene:
- **Hash único**: Un código como `d26cd7f`
- **Autor**: Quién hizo el cambio
- **Fecha**: Cuándo se hizo
- **Mensaje**: Descripción del cambio
- **Cambios**: Qué archivos se modificaron

## 🔄 El Flujo Completo

### Desde tu computadora hasta GitHub:

```
1. Trabajas en archivos
   ↓
2. git add (preparas cambios)
   ↓
3. git commit (guardas en historial local)
   ↓
4. git push (subes a GitHub)
```

### Comandos paso a paso:

```bash
# 1. Ver el estado actual
git status

# 2. Preparar archivos
git add archivo.txt
# o preparar todos:
git add .

# 3. Hacer commit
git commit -m "Agregué nueva funcionalidad"

# 4. Subir a GitHub
git push origin nombre-de-rama
```

## ✏️ Editar Archivos Ya Publicados

Si ya publicaste un archivo y quieres editarlo:

### Opción 1: Desde tu computadora

```bash
# 1. Asegúrate de tener la versión más reciente
git pull origin main

# 2. Edita el archivo con tu editor favorito
# (VSCode, Notepad++, nano, vim, etc.)

# 3. Ver qué cambió
git diff archivo.txt

# 4. Preparar y hacer commit
git add archivo.txt
git commit -m "Actualicé el archivo"

# 5. Subir cambios
git push origin main
```

### Opción 2: Desde GitHub (interfaz web)

1. Ve a tu repositorio en GitHub
2. Haz clic en el archivo que quieres editar
3. Haz clic en el ícono del lápiz (✏️) arriba a la derecha
4. Edita el contenido
5. Abajo, escribe un mensaje de commit
6. Haz clic en "Commit changes"

## 📸 Subir Fotos e Imágenes

### Método 1: Desde tu computadora

```bash
# 1. Copia tus fotos a la carpeta del repositorio
cp /ruta/a/tu/foto.jpg /ruta/del/repositorio/imagenes/

# 2. Agregar al repositorio
git add imagenes/foto.jpg

# 3. Hacer commit
git commit -m "Agregué foto de ejemplo"

# 4. Subir a GitHub
git push origin main
```

### Método 2: Desde GitHub (interfaz web)

1. Ve a tu repositorio en GitHub
2. Navega a la carpeta donde quieres la imagen (o crea una nueva)
3. Haz clic en "Add file" → "Upload files"
4. Arrastra tus fotos o haz clic para seleccionarlas
5. Escribe un mensaje de commit
6. Haz clic en "Commit changes"

### Método 3: Para usar en README o documentos

Si quieres mostrar una imagen en un archivo Markdown (`.md`):

```markdown
# Usando una imagen del repositorio
![Descripción de la imagen](imagenes/foto.jpg)

# Usando una imagen de internet
![Descripción de la imagen](https://ejemplo.com/foto.jpg)
```

## 🎯 Ejemplo Práctico Completo

Imagina que quieres agregar una foto de un atardecer:

```bash
# 1. Crear carpeta para imágenes
mkdir imagenes

# 2. Copiar tu foto ahí
cp ~/Descargas/atardecer.jpg imagenes/

# 3. Ver el estado
git status
# Output: Untracked files: imagenes/atardecer.jpg

# 4. Preparar la imagen
git add imagenes/atardecer.jpg

# 5. Hacer commit
git commit -m "Agregué foto de atardecer"

# 6. Subir a GitHub
git push origin main
```

Ahora puedes usar la foto en tu README:

```markdown
# Mi Proyecto

¡Mira este hermoso atardecer!

![Atardecer](imagenes/atardecer.jpg)
```

## 📝 Consejos Importantes

1. **Haz commits frecuentemente**: Es mejor tener muchos commits pequeños que uno grande
2. **Mensajes claros**: Escribe mensajes descriptivos ("Agregué menú de navegación" es mejor que "cambios")
3. **Pull antes de push**: Siempre haz `git pull` antes de `git push` para evitar conflictos
4. **No subas archivos grandes**: GitHub tiene límite de 100MB por archivo
5. **Usa .gitignore**: Para no subir archivos innecesarios (como node_modules, .env, etc.)

## 🔍 Comandos Útiles para Explorar

```bash
# Ver diferencias sin hacer commit
git diff

# Ver cambios de un archivo específico
git diff archivo.txt

# Ver información de un commit específico
git show d26cd7f

# Ver quién modificó cada línea de un archivo
git blame archivo.txt

# Ver el historial de un archivo específico
git log -- archivo.txt
```

## ❓ Preguntas Frecuentes

**P: ¿Puedo deshacer un commit?**
R: Sí, pero depende:
```bash
# Deshacer el último commit pero mantener cambios
git reset --soft HEAD~1

# Deshacer el último commit y los cambios
git reset --hard HEAD~1
```

**P: ¿Cómo veo los cambios antes de hacer commit?**
R: Usa `git diff` para ver las diferencias

**P: ¿Qué pasa si olvido el mensaje en el commit?**
R: Git abrirá un editor de texto para que escribas el mensaje

**P: ¿Puedo cambiar el mensaje de un commit ya hecho?**
R: Sí, si es el último commit:
```bash
git commit --amend -m "Nuevo mensaje"
```

## 🎓 Recursos Adicionales

- [Git - La guía sencilla](https://rogerdudler.github.io/git-guide/index.es.html)
- [Documentación oficial de Git](https://git-scm.com/book/es/v2)
- [GitHub Docs en Español](https://docs.github.com/es)

---

¿Tienes más preguntas? Abre un "Issue" en este repositorio o consulta la documentación oficial de Git y GitHub.
