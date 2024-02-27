---
title: "Rural Segmentation"
description: "Recipes, guides, and tutorials for Blowfish"
draft: false
date: 2017-10-31
    
tags: ["experience", "python", "sql"]
---

El objetivo general del proyecto de Censos Nacionales (CPV2017) es contar con información actualizada de las actividades realizadas en los procesos de Segmentación. Como parte de este proceso, la primera parte corresponde a una actualización cartográfica y registro de viviendas y establecimientos, para lo cual se requiere lo siguiente:

- Disponer de una base de datos espacial para la segmentación
- Contar con el mapa actualizado de cada uno de los distritos del país
- Contar con el plano actualizado de cada uno de los centros poblados urbanos del país.
- Disponer de un directorio de viviendas urbanas y rurales

El siguiente paso viene a ser la segmentación, para lo cual se ha dividido en diferentes procesos:

- Elaborar de forma automatizada las áreas de empadronamiento urbano y rural (croquis y listados) que se asignará a los/las empadronadores/as como carga de trabajo en el día del Censo.
- Estimar el número de cédulas y documentos necesarios para el empadronamiento nacional.
- Conformar las secciones censales y determinar la cantidad de jefes/as de sección necesaria para el empadronamiento.
- Estimar el número de funcionarios censales: Jefes/as de zona, jefes/as de sección y empadronadores/as.
- Como parte de las actividades realizadas, se ha compuesto de la siguiente manera:

Desarrollo de la actualización cartográfica

- Recopilación de data en campo
- Consistenciar BD
- Consistencia espacial
- Consistencia de datos
- Consistencia
- Pruebas de calidad

Desarrollo de la segmentación:

- Carga de base de datos
- Pruebas de calidad Pre Segmentación
- Segmentación urbana
- Segmentación rural

Principalmente, para el desarrollo de la segmentación rural, se realizó lo siguiente:

- Formación de las áreas de empadronamiento rural (AER)
- Formación de las secciones censales rurales (SCR)
- Generación de listados de la segmentación rural
    - Listado de viviendas del área de empadronamiento rural
    - Listado de áreas de empadronamiento de la sección censal rural
    - Listado de áreas de empadronamiento del distrito.
- Elaboración y generación del croquis para la segmentación rural
    - Croquis del área de empadronamiento rural
    - Croquis de la sección censal rural
    - Impresión simultánea de los listados y croquis rurales
- Desarrollo del sistema integrado de la segmentación
    - Módulo de segmentación
    - Módulo de croquis y listados
    - Módulo de control de calidad
    - Módulo de impresión
    - Módulo de legajos
    - Módulo de reportes
- Pruebas de calidad de segmentación

{{< github repo="ryali93/SegmRural" >}}

![](mapa.jpg)