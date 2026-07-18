# Assistent virtual de COELBO (Fase 1)

Chatbot **autònom, sense frameworks ni backend**, per orientar els visitants
del web de COELBO sobre les tres famílies de producte i derivar a l'equip
tècnic tot el que queda fora de la Fase 1.

> COELBO **no fabrica bombes**: fabrica els dispositius electrònics que
> controlen i protegeixen les electrobombes. L'assistent ho té present i ho
> aclareix quan cal.

## Fitxers

```
chatbot/
├── chatbot.css        # Estils del widget (encapsulats sota .coelbo-chat)
├── chatbot.js         # Motor de regles + base de coneixement + UI
├── demo.html          # Pàgina de prova per revisar-lo
├── system-prompt.md   # Prompt de sistema i material d'entrenament (referència)
└── README.md          # Aquest fitxer
```

## Com provar-lo en local

Qualsevol servidor estàtic serveix:

```bash
python3 -m http.server 8080
# obriu http://localhost:8080/chatbot/demo.html
```

## Com adjuntar-lo al web de COELBO

Copieu la carpeta `chatbot/` al web de COELBO i afegiu aquestes dues línies a
les pàgines on vulgueu l'assistent (CSS al `<head>`, JS abans de `</body>`),
ajustant la ruta a l'estructura del web:

```html
<link rel="stylesheet" href="chatbot/chatbot.css">
<script defer src="chatbot/chatbot.js"></script>
```

El widget s'auto-inicialitza, crea el botó flotant i pren l'idioma de
l'atribut `lang` de la pàgina com a idioma inicial (amb selector manual
CA/ES/EN/FR/IT a la capçalera). Funciona sobre qualsevol web de COELBO
(estàtic o amb CMS) perquè és HTML/CSS/JS pur, sense dependències.

## Abast funcional (Fase 1)

**Orienta sobre:**
- Què és cada família i per a què serveix.
- Quina família encaixa segons l'ús (habitatge, comunitat, edifici, hotel,
  drenatge, ús industrial…).
- On trobar catàlegs, manuals i contacte.

**Deriva sempre a l'equip tècnic (`coelbo@coelbo.es` · `(+34) 93 736 29 50`):**
- Configuració, paràmetres i valors d'ajust.
- Avaries, diagnòstics i codis d'error.
- Compatibilitat amb un model concret de bomba.
- Preus, terminis, estoc i comandes.
- Garanties, devolucions (RMA) i reclamacions.

## Com funciona (motor)

`chatbot.js` normalitza el text (minúscules, sense accents), detecta l'idioma
per paraules freqüents i classifica la consulta per **prioritat**: primer les
intencions fora d'abast (preu, configuració, avaria, compatibilitat, estoc,
garantia) i després orientació de famílies i casos d'ús. Cada intenció té una
resposta curta i formal en els cinc idiomes (objecte `I18N`).

Per ampliar respostes o paraules clau, editeu els objectes `KW` (paraules
clau) i `I18N` (textos) de `chatbot.js`.

## Nota sobre la Fase 2

La configuració i els paràmetres dels aparells estan previstos per a una
Fase 2; de moment l'assistent els deriva. El motor és ampliable: COELBO pot
afegir noves intencions i respostes editant `KW` i `I18N`, ampliar la base de
coneixement amb el contingut dels catàlegs, o connectar-lo a un servei amb un
model de llenguatge si més endavant es vol comprensió de llenguatge natural
més oberta.

### Connexió amb una IA real (Claude) — ja preparada

El widget pot funcionar amb un **model d'IA real** (per defecte Google Gemini,
en la seva capa gratuïta) perquè raoni i redacti cada resposta en lloc de fer
servir el motor de regles. Cal un petit backend (Cloudflare Worker) que guardi
la clau de l'API; el codi i els passos estan a [`backend/`](./backend/). Si es
configura l'endpoint
(`window.COELBO_AI_ENDPOINT` o la constant `AI_ENDPOINT` de `chatbot.js`),
l'assistent usa la IA i **recau en el motor de regles** si la IA falla.
