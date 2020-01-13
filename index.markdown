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

> Par défaut, les données sont représentées par minute

## Données

Les données utilisées pour la visualisation ont été générées par nos soins, et suivent un cycle ETL (Extract Transform Load).

### Extraction des données

Chacun des sites représentés sur la visualisation provient d'une session d'environ *10 minutes*, passée uniquement sur ce site web comme un utilisateur lambda le ferait.

Une fois la session de 10 minutes terminée, nous pouvons exporter les informations récoltées grâce au bouton d'export de l'[outil d'inspection natif des navigateurs chromium](https://developers.google.com/web/tools/chrome-devtools/network) :

![](img/network_chrome.png){:width="75%"}

Dans le cadre de la récupération de données provenant de site de même catégories, nous avons au mieux essayé de les comparer en reproduisant des comportements identiques. Par exemple pour la récupération des données provenant des différents moteurs de recherche, nous avons effectué les mêmes recherches en suivant le même protocole pour chacun des sites.

Après avoir terminé la session, les résultats sont exportés au format `.har` et ensuites mis dans leur dossier de catégorie correspondante :

```
├── cinema
│   ├── Allocine.har
│   ├── Imdb.har
│   └── Rottentomatoes.har
├── mail
│   ├── Google.har
│   └── Hotmail.har
├── news
│   ├── 20minutes.har
│   ├── Korben.info.har
│   ├── Lefigaro.har
│   ├── Lemonde.har
│   ├── Nytimes.har
│   └── Washingtonpost.har
├── search
│   ├── Bing.har
│   ├── Duckduckgo.har
│   ├── GoogleImages.har
│   ├── Qwant.har
│   └── Yahoo.har
```

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
      ],
      "average": <average site>
    },
  ]
}
```


### Chargement des données

Les données sont ensuite chargées dans la [visualisation](./dataviz.html) directement en format `.json` par d3.js.

Voici un schéma pour résumer ce processus 

![](img/ETL.png)
