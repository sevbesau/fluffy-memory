# Code samples

Deze repo bevat een paar leuke projectjes om eens onder de loep te nemen.

## NPM Packages
**db** en **envalidate** zijn twee npm packages die ik in bijna al mijn backends gebruik.

### DB
**db** is een simpele wrapper rond mongoose om niet telkens dezelfde code opnieuw te schrijven om met de db te verbinden. 

### Envalidate
**envalidate** bevat een functie die een error opwerpt wanneer de nodige env vars niet ingesteld zijn om er voor te zorgen dat deze altijd aanwezig zijn.

## Projects
Verder zitten er ook nog twee projectjes in deze reop: **locksmith** en **anchor**.

### Locksmith
**Locksmith** is mijn laatste experimentje met jwt microservice authenticatie. Het is meer een proof of concept en *leerprojectje* dan een production-ready auth service, maar het illustreert wel goed mijn coding style.

### Anchor
Last but not least **Anchor** is mijn versie van een ci-cd systeem. De laatste tijd werk ik in een grote monorepo die al mijn packages en projecten bevat, aangezien dit mijn *custom package supported development process* een enorme boost geeft. 
Dit betekend ook dat al mijn projecten een heel voorspelbare overkoepelende structuur hebben en ik hier gebruik van kan maken om het hosten, builden, updaten, etc te streamlinen.

Met anchor kan ik dan aan de hand van API calls services van projecten builden en installeren.
Anchor leest de nodige config files van het project in, en weet aan de hand daarvan hoe het project geconfigureerd, gebuild, etc moet worden.
