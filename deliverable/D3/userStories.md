# Requisiti funzionali

## Requisiti funzionali comuni a tutti gli utenti

### RF 1 Homepage
Il sistema deve consentire a tutti gli utenti di essere in grado di visualizzare integralmente la mappa del comune di Trento divisa per quartieri non appena si apre la web-app.
- Come utente voglio visualizzare la mappa del comune di Trento divisa per quartieri, così da perter avere una visione d'insieme

### RF 2 Interazione con la mappa
Il sistema deve permettere a tutti gli utenti di interagire con la mappa del comune di Trento, in particolare deve essere possibile: ingrandire, rimpicciolire e spostarsi all'interno della mappa tramite il mouse o i pulsanti.
- Come utente voglio poter ingrandire o rimpicciolire la mappa, così da poter avere una visione migliore dell'area che si vuole visualizzare
- Come utente voglio poter spostare il focus della mappa, così da poter cambiare l'area che si sta visualizzando
- Come utente voglio poter cliccare sulla mappa, così da poter selezionare un quartiere del quale si vogliono avere maggiori informazioni

### RF 4 Accesso dati quartieri
Il sistema deve permettere a tutti gli utenti di selezionare qualunque dei vari quartieri della città. Selezionare un quartiere consentirà all'utente di visualizzare i dati generici (num popolazione, felicità, età media, servizi,\dots) relativi al quartiere selezionato. Inoltre la mappa visualizzata sposterà il focus e si ingrandirà su di questo. Quando un quartiere è selezionato verrà evidenziato, sarà inoltre possibile de-selezionarlo cliccando nuovamente sullo stesso quartiere o cliccando su di un altro quartiere.
- Come utente voglio poter visualizzare i dati del quartiere selezionato, così da poter ricevere informazioni più dettagliate di tale quartiere
- Come utente voglio avere una visualizzazione più dettagliata del quartiere selezionato e del suo circondario, così da avere una visione più dettagliata del quartiere e così da potermi muovere con un singolo click nei quartieri circostanti
- Come utente voglio poter tornare alla visualizzazione integrale della mappa, così da poter cambiare il quartiere selezionato

### RF 6 Autenticazione (Leggermente Rivisitata)
Il sistema deve permettere a tutti gli utenti loggati di accedere al loro account premendo un tasto di login in altro a destra, il quale renderizzerà gli utenti alla pagina di login attraverso l'inserimento di: "Nome Utente" e "Password". Una volta eseguito l'accesso si verrà renderizzati alla pagina appropriata a seconda dei ruoli abilitati del sistema, se l'utente non ha un ruolo abilitato non potrà allora verrà reindirizzato alla pagina principale con un messaggio di errore tramite un pop-up che informerà l'utente che non ha i permessi per accedere al sistema. Se l'utente è già loggato al posto del tasto di login comparirà l'icona del proprio profilo affianco a quella del tipo "hamburger" che attiverà un menu.
- 