# Requisiti funzionali

## Requisiti funzionali comuni a tutti gli utenti

### RF 1 Homepage
Il sistema deve consentire a tutti gli utenti di essere in grado di visualizzare integralmente la mappa del comune di Trento divisa per quartieri non appena si apre la web-app.
- Come utente voglio visualizzare la mappa del comune di Trento divisa per quartieri, così da perter avere una visione d'insieme

### RF 2 Interazione con la mappa
Il sistema deve permettere a tutti gli utenti di interagire con la mappa del comune di Trento, in particolare deve essere possibile: ingrandire, rimpicciolire e spostarsi all'interno della mappa tramite il mouse o i pulsanti.
- Come utente voglio poter ingrandire o rimpicciolire la mappa, così da poter avere una visione migliore dell'area che si vuole visualizzare
- Come utente voglio poter spostare il focus della mappa, così da poter cambiare l'area che si sta visualizzando

### RF 4 Accesso dati quartieri
Il sistema deve permettere a tutti gli utenti di selezionare qualunque dei vari quartieri della città. Selezionare un quartiere consentirà all'utente di visualizzare i dati generici (num popolazione, felicità, età media, servizi,\dots) relativi al quartiere selezionato. Inoltre la mappa visualizzata sposterà il focus e si ingrandirà su di questo. Quando un quartiere è selezionato verrà evidenziato, sarà inoltre possibile de-selezionarlo cliccando nuovamente sullo stesso quartiere o cliccando su di un altro quartiere.
- Come utente voglio poter visualizzare i dati del quartiere selezionato, così da poter ricevere informazioni più dettagliate di tale quartiere
- Come utente voglio avere una visualizzazione più dettagliata del quartiere selezionato e del suo circondario, così da avere una visione più dettagliata del quartiere e così da potermi muovere con un singolo click nei quartieri circostanti
- Come utente voglio poter tornare alla visualizzazione integrale della mappa, così da poter cambiare il quartiere selezionato

### RF 6 Autenticazione (Leggermente Rivisitata)
Il sistema deve permettere a tutti gli utenti loggati di accedere al loro account premendo un tasto di login in altro a destra, il quale renderizzerà gli utenti alla pagina di login attraverso l'inserimento di: "Nome Utente" e "Password". Nel caso in cui l'utente non avesse un ruolo abilitato questo verrà reindirizzato alla pagina principale con un messaggio di errore tramite pop-up che informerà dei mancati permessi per accedere al sistema.
- Come utente voglio poter accedere tramite Nome Utente e Password, così da poter avere accesso alle funzionalità fornite dall'utente

### RF 7 Cambio icona login
Successivamente al processo di autenticazione per qualsiasi utente loggato verrà sostituita l'icona del login con l'immagine del profilo con il quale si è fatto l'accesso.
- Come utente loggato voglio poter visualizzare l'immagine del profilo, così da essere sicuro di aver effettuato l'accesso con l'account giusto

### RF 8 Visualizzazione dati sondaggisti
Il sistema deve permettere ai sondaggisti di visualizzare tramite una pagina dedicata l'interfaccia per gestire i sondaggi. In questa interfaccia deve essere presente una tabella contenente il riassunto dei dati relativi alle cartelle di sondaggi inserite da loro stessi con relativo stato di approvazione, nel caso in cui non fossero ancora stati approvati saranno inoltre disponibili dei pulsanti per eliminare e/o modificare i dati inseriti.
- Come sondaggista voglio creare o caricare i sondaggi, così da poter iniziare una nuova sessione di sondaggi
- Come sondaggista voglio visualizzare i vari sondaggi con il relativo stato di approvazione, così da poter sapere quali sondaggi sono da finire, quali da modificare o quali da cancellare

### RF 9 Accesso come sondaggista
Il sistema successivamente al processo di autenticazione reindirizzerà automaticamente i vari account sondaggisti alla corrispettiva pagina dedicata, così facendo verrà velocizzata e semplificata la procedura d'accesso limitando inoltre le funzionalità fornite ai sondaggisti.
- Come sondaggista voglio visualizzare subito l'interfaccia per gestire i sondaggi, così da poter iniziare, modificare o eliminare i sondaggi rapidamente

### RF 10 Creazione nuovi sondaggi
Il sistema deve permettera ai sondaggisti di creare nuovi sondaggi. Questo deve essere possibile in due maniere diverse: creando un nuovo sondaggio vuoto oppure caricando un file contenente i dati di un sondaggio in corso. Questi sondaggi "in sospeso" potranno essere cancellati oppure presentati agli amministratori per essere accettati nel sistema o rifiutati. I dati inseriti dei sondaggi in sospeso non saranno visibili agli altri utenti e non saranno neanche considerati dal sistema fino a quando non verranno approvati da un utente amministratore.
- Come sodaggista voglio poter creare o caricare dei nuovi sondaggi, così da poter iniziare un nuovo sondaggio
<!--  dubbio: devo mettere delle US per il caricamento o la modifica anche se potrei metterli per l'RF12?  -->

### RF 11 Svolgimento sondaggi
Il sistema deve permettere ai sondaggisti di aggiungere nuovi voti ai sondaggi in sospeso. Tramite una pagina apposita, utilizzabile anche da sistemi mobili, sarà possibile inserire nuovi voti, aggiungendo obbligatoriamente informazioni sulla circoscrizione di appartenenza e a scelta volontaria del cittadino la propria età.