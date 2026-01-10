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

## 🔀 Pull Requests (PR) - Solicitudes de Extracción

Un **Pull Request** (o **PR**) es una solicitud para integrar tus cambios en una rama principal. Es como decir: "Aquí están mis cambios, ¿puedes revisarlos y aceptarlos?"

### ¿Qué es un Pull Request?

Imagina que trabajas en un equipo. No quieres hacer cambios directamente en el código principal (rama `main`), porque podrías romper algo. En lugar de eso:

1. Creas una rama nueva para trabajar
2. Haces tus cambios en esa rama
3. Creas un **Pull Request** pidiendo que revisen tus cambios
4. Otros pueden comentar, sugerir mejoras, o aprobar
5. Una vez aprobado, tus cambios se fusionan (merge) a la rama principal

### El Flujo Completo de un Pull Request

```
1. Crear rama nueva
   ↓
2. Hacer cambios y commits
   ↓
3. Subir rama a GitHub (push)
   ↓
4. Crear Pull Request en GitHub
   ↓
5. Revisión y comentarios
   ↓
6. Hacer cambios adicionales si es necesario
   ↓
7. Aprobar y fusionar (merge)
   ↓
8. Eliminar rama (opcional)
```

### Cómo Crear un Pull Request

#### Desde la Línea de Comandos + GitHub:

```bash
# 1. Crear y cambiar a una nueva rama
git checkout -b mi-nueva-funcionalidad

# 2. Hacer cambios en tus archivos
# (edita archivos con tu editor favorito)

# 3. Preparar y hacer commit
git add .
git commit -m "Agregué nueva funcionalidad X"

# 4. Subir la rama a GitHub
git push origin mi-nueva-funcionalidad

# 5. GitHub mostrará un mensaje con un enlace para crear el PR
# O ve a GitHub manualmente y crea el PR desde la interfaz web
```

#### Desde GitHub (Interfaz Web):

1. Ve a tu repositorio en GitHub
2. Verás un banner amarillo que dice "Compare & pull request" después de hacer push
3. O haz clic en "Pull requests" → "New pull request"
4. Selecciona:
   - **Base**: La rama donde quieres fusionar (ej: `main`)
   - **Compare**: Tu rama con los cambios (ej: `mi-nueva-funcionalidad`)
5. Escribe un título descriptivo
6. Escribe una descripción detallada de tus cambios
7. Haz clic en "Create pull request"

### Anatomía de un Pull Request

Un PR contiene:

- **Título**: Resumen breve de los cambios
- **Descripción**: Explicación detallada de qué cambios hiciste y por qué
- **Commits**: Lista de todos los commits en tu rama
- **Files changed**: Vista de todos los archivos modificados
- **Conversación**: Espacio para comentarios y discusión
- **Revisores**: Personas asignadas para revisar el código
- **Labels**: Etiquetas para categorizar (bug, enhancement, etc.)
- **Checks**: Pruebas automáticas que se ejecutan

### Estados de un Pull Request

- **Open (Abierto)**: El PR está esperando revisión o cambios
- **Draft (Borrador)**: PR en progreso, no listo para revisión
- **Ready for review**: Listo para que otros lo revisen
- **Approved**: Revisores aprobaron los cambios
- **Changes requested**: Revisores pidieron modificaciones
- **Merged**: Los cambios se fusionaron a la rama principal
- **Closed**: El PR fue cerrado sin fusionar

### Revisar un Pull Request

Como revisor, puedes:

```bash
# 1. Ver los cambios en GitHub (interfaz web)
# O descargar la rama para probarla localmente:

# 2. Obtener la rama del PR
git fetch origin
git checkout nombre-de-rama-del-pr

# 3. Probar los cambios
# (ejecuta el código, pruebas, etc.)

# 4. Volver a tu rama
git checkout main
```

En GitHub, puedes:
- Comentar en líneas específicas de código
- Sugerir cambios directamente
- Aprobar el PR
- Solicitar cambios
- Comentar en general

### Hacer Cambios Después de Crear el PR

Si necesitas hacer cambios después de crear el PR:

```bash
# 1. Asegúrate de estar en la rama correcta
git checkout mi-nueva-funcionalidad

# 2. Hacer cambios en archivos

# 3. Preparar y hacer commit
git add .
git commit -m "Corrección basada en feedback"

# 4. Subir cambios
git push origin mi-nueva-funcionalidad

# Los cambios aparecerán automáticamente en el PR
```

### Fusionar un Pull Request

Hay tres formas de fusionar en GitHub:

#### 1. **Merge Commit** (Por defecto)
```
main:     A---B---C-------G
               \         /
feature:        D---E---F
```
Crea un commit de fusión que une ambas ramas. Mantiene todo el historial.

#### 2. **Squash and Merge**
```
main:     A---B---C---D'
```
Combina todos los commits de la rama en uno solo. Historial más limpio.

#### 3. **Rebase and Merge**
```
main:     A---B---C---D---E---F
```
Reaplica los commits uno por uno sobre la rama principal. Historial lineal.

### Comandos Útiles para PRs

```bash
# Ver PRs abiertos (requiere GitHub CLI)
gh pr list

# Ver detalles de un PR
gh pr view 123

# Crear PR desde línea de comandos
gh pr create --title "Título" --body "Descripción"

# Revisar un PR localmente
gh pr checkout 123

# Fusionar un PR
gh pr merge 123

# Ver el estado de checks/pruebas
gh pr checks
```

### Buenas Prácticas para Pull Requests

1. **Título claro y descriptivo**
   - ❌ "Cambios"
   - ✅ "Agregar validación de email en formulario de registro"

2. **Descripción completa**
   - Qué problema resuelve
   - Cómo lo resuelve
   - Capturas de pantalla (si hay cambios visuales)
   - Cómo probarlo

3. **PRs pequeños**
   - Es mejor hacer varios PRs pequeños que uno gigante
   - Más fácil de revisar y aprobar

4. **Un tema por PR**
   - No mezcles múltiples características o correcciones
   - Mantén el alcance enfocado

5. **Commits lógicos**
   - Cada commit debe ser una unidad lógica de cambio
   - Mensajes de commit claros

6. **Prueba antes de crear el PR**
   - Asegúrate de que todo funciona
   - Ejecuta pruebas si existen

7. **Responde a comentarios**
   - Mantén la conversación activa
   - Agradece el feedback
   - Explica tus decisiones si es necesario

### Ejemplo de Descripción de PR

```markdown
## Descripción
Agrega validación de email en el formulario de registro para evitar
que usuarios ingresen emails inválidos.

## Cambios
- Agregué función `validarEmail()` en `utils/validation.js`
- Actualicé el componente de registro para usar la validación
- Agregué tests para la nueva función
- Actualicé documentación en README

## Pruebas
1. Ir a la página de registro
2. Intentar registrarse con email inválido (ej: "test")
3. Debe mostrar error "Email inválido"
4. Intentar con email válido (ej: "test@example.com")
5. Debe permitir continuar

## Capturas de pantalla
[Adjuntar capturas aquí]

## Checklist
- [x] El código compila sin errores
- [x] Agregué tests
- [x] Actualicé la documentación
- [x] Probé los cambios localmente
```

### Conflictos en Pull Requests

A veces tu rama y la rama principal tienen cambios en los mismos archivos. Esto causa **conflictos**.

#### Resolver conflictos:

```bash
# 1. Actualizar tu rama local con los últimos cambios de main
git checkout mi-rama
git fetch origin
git merge origin/main

# 2. Git te dirá qué archivos tienen conflictos
# Edita esos archivos manualmente

# 3. Los conflictos se ven así:
<<<<<<< HEAD
// Tu código
=======
// Código de main
>>>>>>> origin/main

# 4. Elige qué código mantener, elimina los marcadores

# 5. Preparar archivos resueltos
git add archivo-con-conflicto.js

# 6. Completar el merge
git commit -m "Resuelvo conflictos con main"

# 7. Subir cambios
git push origin mi-rama
```

### Draft Pull Requests (Borradores)

Los **Draft PRs** te permiten compartir trabajo en progreso:

```bash
# Crear un Draft PR con GitHub CLI
gh pr create --draft --title "WIP: Nueva funcionalidad" --body "Trabajo en progreso"
```

Beneficios:
- Compartir código temprano para feedback
- Mostrar progreso
- Colaborar antes de completar
- No se puede fusionar hasta marcar como "Ready for review"

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

**P: ¿Cuál es la diferencia entre un Issue y un Pull Request?**
R: 
- **Issue**: Para reportar problemas, sugerir funcionalidades, o discutir ideas
- **Pull Request**: Para proponer cambios de código específicos que pueden fusionarse

**P: ¿Puedo crear un PR desde un fork?**
R: Sí, es muy común. Haces fork del repositorio, creas cambios en tu fork, y luego creas un PR al repositorio original.

**P: ¿Qué pasa si cierro un PR sin fusionar?**
R: Los cambios siguen en tu rama, pero el PR se marca como cerrado. Puedes reabrir el PR más tarde si quieres.

**P: ¿Puedo tener múltiples PRs abiertos al mismo tiempo?**
R: Sí, puedes tener varios PRs desde diferentes ramas trabajando en diferentes funcionalidades.

## 🎓 Recursos Adicionales

- [Git - La guía sencilla](https://rogerdudler.github.io/git-guide/index.es.html)
- [Documentación oficial de Git](https://git-scm.com/book/es/v2)
- [GitHub Docs en Español](https://docs.github.com/es)

---

¿Tienes más preguntas? Abre un "Issue" en este repositorio o consulta la documentación oficial de Git y GitHub.
