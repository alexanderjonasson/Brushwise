# Brushwise – projektplan

> AI-driven målningsassistent för miniatyrhobbyn. Fota det du målat och få feedback,
> få målningsrecept utifrån färgerna du äger, och håll koll på din samling.

## Mål

1. **Portfolio:** visa AI-integration (bildanalys, strukturerad output, tool use, streaming) ovanpå en solid fullstack-grund.
2. **Lärande:** du ska kunna förklara varje del på en intervju.
3. **Användbar på riktigt:** du ska själv vilja använda den mellan målningssessionerna.

---

## Funktioner

### MVP (version 1) – det här ska vara klart först

| # | Funktion | Vad den visar |
|---|---|---|
| 1 | Konto och inloggning | Auth, skyddade sidor (som i Bookwell) |
| 2 | **Samling:** lägg till figurer med namn, fraktion/projekt och status (Omålad → Påbörjad → Klar) | CRUD, Server Actions, Zod |
| 3 | **Bilduppladdning:** ladda upp foton på en figur | Filuppladdning, bildlagring (nytt) |
| 4 | **AI-feedback:** välj en bild, så analyserar AI:n målningen och ger betyg och konkreta tips per område (kontrast, kanter, highlights, basing) | Bildanalys, strukturerad output (JSON + Zod), streaming |
| 5 | **Galleri per figur** med bilder och tidigare feedback | Relationer i databasen |

### Version 2 – när MVP:n fungerar och är driftsatt

| # | Funktion | Vad den visar |
|---|---|---|
| 6 | **Färglista:** registrera färgerna du äger | CRUD |
| 7 | **Målningsrecept:** ladda upp en inspirationsbild och få ett steg-för-steg-recept med *dina* färger | **Tool use**: AI:n anropar ett verktyg som läser din färglista |
| 8 | **"Spara som projekt":** AI:n kan själv lägga till receptet som en ny figur i samlingen | Tool use som *skriver* till databasen |
| 9 | **Statistik:** pile of shame över tid, antal klara per månad | Aggregering, diagram |

### Senare / bonus
- Jämför före- och efterbild ("hur mycket har jag förbättrats?")
- Dela en figur publikt via länk
- Mobilanpassad kamerauppladdning

---

## Teknikval

| Del | Val | Varför |
|---|---|---|
| Ramverk | **Next.js (App Router) + React + TypeScript (strict)** | Samma som Bookwell, så du kan fokusera på det nya |
| Databas | **PostgreSQL + Prisma** | Du kan det redan; Docker lokalt, Neon i produktion |
| Auth | **Better Auth** | Samma som Bookwell |
| Validering | **Zod** | Används både för formulär och för att validera AI:ns svar |
| Styling | **Tailwind CSS** | |
| Bildlagring | **Vercel Blob** (alternativt Cloudflare R2/S3) | Enkelt att koppla till Vercel |
| AI | **Claude API via `@anthropic-ai/sdk`**, modell `claude-opus-5-5` | Stöder bilder, strukturerad output, tool use och streaming |
| Tester | **Vitest + Playwright** | AI-anropen mockas i tester, så att de är snabba och gratis |
| CI/Hosting | **GitHub Actions + Vercel** | |

### Om AI-delen

- **Feedback (MVP):** ett anrop till Messages API med bilden och en instruktion. Svaret tvingas till ett fast format med *structured outputs* och valideras med Zod, så att gränssnittet kan visa betyg och tips snyggt i stället för en textvägg. Svaret strömmas så att användaren ser det växa fram.
- **Recept (v2):** Messages API med *tool use*. Vi definierar verktyg som `getMyPaints` och `createMiniature`, och SDK:ns tool runner sköter loopen. Det här är ett styrt arbetsflöde, inte en fri agent, så vi kör det på vår egen server.
- **Säkerhet och kostnad:**
  - API-nyckeln finns bara på servern (`server-only`) och läggs aldrig i koden eller i git.
  - Begränsa antal AI-anrop per användare och dag, så att en publik demo inte kan bränna pengar.
  - Begränsa bildstorlek och bildtyp vid uppladdning.
  - Hantera fall där AI:n avböjer eller svarar fel, med ett vänligt felmeddelande.
  - Opus 5.5 kostar ungefär $4 per miljon input-tokens. Vill du hålla nere kostnaden i demon kan vi byta till en billigare modell (Sonnet eller Haiku). Det är ditt beslut, och vi kan mäta skillnaden i kvalitet först.

---

## Datamodell (första utkast)

```
User
 ├─ Miniature        namn, fraktion/projekt, status, anteckningar, skapad
 │   └─ Photo        bild-URL, uppladdad
 │       └─ Feedback betyg, sammanfattning, tips per område (JSON), modell, skapad
 ├─ Paint            namn, märke, färgtyp (base/layer/shade…), hex-färg   (v2)
 └─ Recipe           titel, steg (JSON), källbild, kopplad figur          (v2)
```

---

## Arbetsordning

Varje steg avslutas med att det fungerar, är committat och, från steg 2, driftsatt.

| Steg | Innehåll | Vem |
|---|---|---|
| 0 | Skapa projekt, Git, GitHub-repo, Docker med Postgres, Prisma, Tailwind | Claude bygger och förklarar |
| 1 | Auth (Better Auth) och skyddade sidor | **Du**, Claude stöttar (du har gjort det i Bookwell) |
| 2 | Samling: Miniature-CRUD med Server Actions och Zod | **Du** skriver, Claude granskar |
| 3 | Bilduppladdning till Vercel Blob + Photo-modell | Claude bygger och förklarar |
| 4 | **AI-feedback:** Claude-anrop med bild, structured output och streaming | Claude bygger första versionen och går igenom den rad för rad |
| 5 | Visa feedback snyggt i gränssnittet, galleri per figur | **Du**, Claude stöttar |
| 6 | Rate limiting, felhantering, tester med mockad AI | Tillsammans |
| 7 | Driftsättning (Vercel + Neon), README med skärmdumpar och "How it works" | Tillsammans |
| — | **MVP klar** | |
| 8 | Färglista | **Du** |
| 9 | Målningsrecept med tool use | Claude bygger, du gör nästa verktyg själv |
| 10 | Statistik | **Du** |

### Regler för samarbetet
- **Små commits** med tydliga meddelanden.
- När Claude har byggt något: läs igenom det och ställ frågor tills du kan förklara det själv.
- Skriv ner viktiga beslut och varför i README:n under "How it works", som du gjort i Bookwell.

---

## Saker du behöver ordna själv
- [ ] Skapa ett tomt repo `brushwise` på GitHub
- [ ] Skaffa en API-nyckel på [platform.claude.com](https://platform.claude.com) och fyll på några dollar i krediter
- [ ] (Senare) Konto på Vercel och Neon. Du har redan båda från Bookwell.
