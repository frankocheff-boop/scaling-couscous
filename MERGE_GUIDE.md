# 🔀 Guía Rápida: Cómo Unir (Merge) Ramas al Main

Esta es una guía práctica y directa para fusionar tus ramas de trabajo a la rama principal (`main`).

## 📋 Requisitos Previos

Antes de hacer merge, asegúrate de:
- ✅ Tus cambios están completos y funcionan correctamente
- ✅ Has hecho commit de todos tus cambios
- ✅ Has probado tu código
- ✅ Has actualizado la documentación si es necesario

---

## 🎯 Método 1: Usando Pull Request (Recomendado)

Este es el método más seguro y profesional, especialmente si trabajas en equipo.

### Paso 1: Sube tu rama a GitHub

```bash
# Asegúrate de estar en tu rama
git checkout tu-rama

# Sube la rama a GitHub
git push origin tu-rama
```

### Paso 2: Crea el Pull Request en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/frankocheff-boop/scaling-couscous`
2. Verás un banner amarillo que dice **"Compare & pull request"** - haz clic ahí
3. O ve a la pestaña **"Pull requests"** → **"New pull request"**

### Paso 3: Configura el Pull Request

- **Base**: `main` (la rama donde quieres fusionar)
- **Compare**: `tu-rama` (tu rama con cambios)

Completa:
- **Título**: Descripción corta de tus cambios
- **Descripción**: Explica qué cambiaste y por qué

Ejemplo:
```
Título: Agregué nueva sección de menú de verano

Descripción:
- Creé nueva carpeta "menu de verano"
- Agregué página HTML con menú estacional
- Incluí estilos responsivos
- Agregué imágenes de platillos
```

### Paso 4: Crear y Fusionar

1. Haz clic en **"Create pull request"**
2. GitHub verificará si hay conflictos
3. Si todo está bien, verás el botón **"Merge pull request"**
4. Haz clic en **"Merge pull request"**
5. Confirma haciendo clic en **"Confirm merge"**
6. ¡Listo! Tus cambios ahora están en `main`

### Paso 5: Limpieza (Opcional)

```bash
# Cambia a main
git checkout main

# Actualiza tu main local
git pull origin main

# Elimina tu rama local (ya no la necesitas)
git branch -d tu-rama

# Elimina la rama remota (opcional)
git push origin --delete tu-rama
```

---

## ⚡ Método 2: Merge Directo (Más Rápido)

**⚠️ Advertencia**: Usa este método solo si:
- Estás trabajando solo
- Estás seguro de tus cambios
- No necesitas revisión de código

### Pasos:

```bash
# 1. Asegúrate de que tu rama está actualizada y los cambios están guardados
git checkout tu-rama
git status  # Verifica que no haya cambios sin commit

# 2. Cambia a la rama main
git checkout main

# 3. Actualiza main con los últimos cambios remotos
git pull origin main

# 4. Fusiona tu rama con main
git merge tu-rama

# 5. Si todo está bien, sube los cambios a GitHub
git push origin main

# 6. Elimina tu rama local (opcional)
git branch -d tu-rama
```

### Ejemplo Completo:

```bash
# Estás trabajando en la rama "nueva-galeria"
git checkout nueva-galeria
git add .
git commit -m "Terminé la galería de fotos"

# Cambia a main y fusiona
git checkout main
git pull origin main
git merge nueva-galeria

# Sube a GitHub
git push origin main

# Limpieza
git branch -d nueva-galeria
```

---

## 🚨 Solución de Problemas Comunes

### Problema 1: Conflictos de Merge

Si ves un mensaje como este:
```
CONFLICT (content): Merge conflict in archivo.html
Automatic merge failed; fix conflicts and then commit the result.
```

**Solución**:

```bash
# 1. Git te dirá qué archivos tienen conflictos
git status

# 2. Abre cada archivo con conflicto
# Verás algo como esto:

<<<<<<< HEAD
Código que está en main
=======
Tu código nuevo
>>>>>>> tu-rama

# 3. Edita el archivo manualmente:
# - Decide qué código mantener
# - Elimina los marcadores (<<<<, ====, >>>>)
# - Guarda el archivo

# 4. Marca los archivos como resueltos
git add archivo.html

# 5. Completa el merge
git commit -m "Resuelvo conflictos de merge"

# 6. Sube los cambios
git push origin main
```

### Problema 2: Main está adelantado

Si ves:
```
Your branch is behind 'origin/main' by X commits
```

**Solución**:

```bash
# Actualiza tu main local
git checkout main
git pull origin main

# Luego intenta el merge nuevamente
git merge tu-rama
```

### Problema 3: Necesitas cancelar un merge

Si algo sale mal y quieres cancelar:

```bash
# Cancela el merge en progreso
git merge --abort

# Vuelve al estado anterior
git checkout main
```

### Problema 4: Ya hiciste el merge pero quieres deshacerlo

```bash
# ⚠️ PELIGRO: Esto deshace el último commit (el merge)
# Solo usa si NO has hecho push todavía
git reset --hard HEAD~1

# Si ya hiciste push, NO uses reset
# En su lugar, crea un "revert" que deshace los cambios
git revert -m 1 HEAD
git push origin main
```

---

## 🎨 Diagrama Visual del Proceso

### Antes del Merge:

```
main:      A---B---C
                \
tu-rama:         D---E---F
```

### Después del Merge:

```
main:      A---B---C-------G
                \         /
tu-rama:         D---E---F
```

Donde `G` es el commit de merge que une ambas ramas.

---

## ✅ Checklist Final

Antes de hacer merge a main, verifica:

- [ ] ¿Hice commit de todos mis cambios?
- [ ] ¿Probé que todo funciona?
- [ ] ¿Actualicé la documentación si era necesario?
- [ ] ¿Estoy en la rama correcta?
- [ ] ¿Main está actualizado? (`git pull origin main`)
- [ ] ¿Hay conflictos que necesito resolver?
- [ ] ¿Hice backup por si acaso? (Git lo hace automáticamente)

---

## 🔄 Flujo Completo Recomendado

```bash
# 1. Crea una rama para tu trabajo
git checkout -b mi-nueva-funcionalidad

# 2. Trabaja y haz commits
git add .
git commit -m "Descripción de cambios"

# 3. Sube a GitHub
git push origin mi-nueva-funcionalidad

# 4. Crea Pull Request en GitHub
# (Ve a github.com y sigue las instrucciones de arriba)

# 5. Revisa y fusiona en GitHub
# (Haz clic en "Merge pull request")

# 6. Actualiza tu main local
git checkout main
git pull origin main

# 7. Elimina la rama ya fusionada
git branch -d mi-nueva-funcionalidad
```

---

## 📚 Comandos de Referencia Rápida

```bash
# Ver todas las ramas
git branch -a

# Cambiar de rama
git checkout nombre-rama

# Ver diferencias entre ramas
git diff main..tu-rama

# Ver commits en tu rama que no están en main
git log main..tu-rama --oneline

# Ver el estado actual
git status

# Ver historial gráfico
git log --oneline --graph --all -10
```

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. **Revisa el tutorial completo**: Lee [TUTORIAL_GIT.md](TUTORIAL_GIT.md) para más detalles
2. **Verifica el estado**: Usa `git status` para ver qué está pasando
3. **Busca ayuda**: 
   - [Documentación oficial de Git](https://git-scm.com/book/es/v2)
   - [GitHub Docs en Español](https://docs.github.com/es)

---

## 💡 Consejos Pro

1. **Siempre usa Pull Requests** cuando trabajes en equipo
2. **Haz merge frecuentemente** para evitar conflictos grandes
3. **Mantén commits pequeños** y específicos
4. **Escribe buenos mensajes** de commit
5. **Prueba antes de hacer merge** - ejecuta tests si existen
6. **Actualiza main regularmente** en tu rama de trabajo:
   ```bash
   # Opción 1: Merge (más simple, historial completo)
   git checkout tu-rama
   git merge main
   
   # Opción 2: Rebase (historial más limpio, avanzado)
   git checkout tu-rama
   git rebase main
   ```

---

**¿Todo claro?** Ahora ya sabes cómo unir tus ramas al main. ¡A programar! 🚀

_Para más información detallada sobre Git, branches y Pull Requests, consulta [TUTORIAL_GIT.md](TUTORIAL_GIT.md)_
