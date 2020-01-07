---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Visualisation
---

## Contextualisation

En considérant que tout un chacun n'a pas un forfait de données illimité, il peut être intéressant de classer les différents sites internet visités habituellement suivant leur consommation de cette ressource rare (et éventuellement leurs performances).

## Visualisation

{% include_relative dataviz.html %}

## Données

Les données utilisées pour la visualisation ont été générées par nos soins, et suivent un cycle ETL (Extract Transform Load).

### Extraction des données

Chacun des sites représentés sur la visualisation provient d'une session d'environ *10 minutes*, passée uniquement sur ce site web comme un utilisateur lambda le ferait.

Après avoir terminé l'utilisation, une session est exportée au format `.har` par l'[outil d'inspection natif des navigateurs chromium](https://developers.google.com/web/tools/chrome-devtools/network).

### Transformation des données

Afin d'être utilisables, les données doivent ensuite être transformées dans des formats plus légers et confortables à manipuler.
La visualisation étant destinée à être modifiée souvent, il faut alors en extraire seulement les données pertinentes.

Toute cette partie est gérée par le *Notebook*/*Script* [preprocess.ipynb](https://github.com/DataViz-2019-10/website-data-consumption/blob/master/preprocess.ipynb). Celui-ci prend en entrée des fichiers `.har` lourds de la forme suivante :

``` 
startedDateTime <str> (len: 24)
 time <float>
 request
 |   method <str> (len: 3)
 |   url <str> (len: 24)
 |   httpVersion <str> (len: 8)
 |   headers <list> (len: 13)
 |   queryString <list> (len: 0)
 |   cookies <list> (len: 1)
 |   headersSize <int>
 |   bodySize <int>
 response
 |   status <int>
 |   statusText <str> (len: 0)
 |   httpVersion <str> (len: 8)
 |   headers <list> (len: 18)
 |   cookies <list> (len: 5)
 |   content
 |   |   size <int>
 |   |   mimeType <str> (len: 9)
 |   |   text <str> (len: 528804)
 |   |   encoding <str> (len: 6)
 |   redirectURL <str> (len: 0)
 |   headersSize <int>
 |   bodySize <int>
 |   _transferSize <int>
```

Pour les transformer en fichiers `.json` :

```
{
  "categories": [
    {
      "cat_name": "Search",
      "sites": [
        <site1>,
        <site2>,
        ...
      ],
      "average": <average site>
    },
    {
      "cat_name": "Video",
      "sites": [
        <site1>,
        <site2>,
        ...
        <average site>
      ]
    },
  ]
}
```

### Chargement des données

Les données sont ensuite chargées dans la [visualisation](./dataviz.html) directement en format `.json`.
