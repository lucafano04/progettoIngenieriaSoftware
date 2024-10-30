# Requisiti funzionali

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
- Come utente voglio poter accedere tramite Nome Utente e Password, così da poter avere accesso alle funzionalità fornite all'utente

### RF 7 Cambio icona login
Successivamente al processo di autenticazione per qualsiasi utente loggato verrà sostituita l'icona del login con l'immagine del profilo con il quale si è fatto l'accesso.
- Come utente loggato voglio poter visualizzare l'immagine del profilo, così da essere sicuro di aver effettuato l'accesso con l'account giusto

### RF 8 Visualizzazione dati sondaggisti
Il sistema deve permettere ai sondaggisti di visualizzare tramite una pagina dedicata l'interfaccia per gestire i sondaggi. In questa interfaccia deve essere presente una tabella contenente il riassunto dei dati relativi alle cartelle di sondaggi inserite da loro stessi con relativo stato di approvazione, nel caso in cui non fossero ancora stati approvati saranno inoltre disponibili dei pulsanti per eliminare e/o modificare i dati inseriti.
- Come sondaggista voglio visualizzare i vari sondaggi con il relativo stato di approvazione, così da poter sapere quali sondaggi sono da finire, quali da modificare o quali da cancellare

### RF 9 Accesso come sondaggista
Il sistema successivamente al processo di autenticazione reindirizzerà automaticamente i vari account sondaggisti alla corrispettiva pagina dedicata, così facendo verrà velocizzata e semplificata la procedura d'accesso limitando inoltre le funzionalità fornite ai sondaggisti.
- Come sondaggista voglio visualizzare subito l'interfaccia per gestire i sondaggi, così da poter iniziare, modificare o eliminare i sondaggi senza dover cambiare pagina

### RF 10 Creazione nuovi sondaggi
Il sistema deve permettera ai sondaggisti di creare nuovi sondaggi. Questo deve essere possibile in due maniere diverse: creando un nuovo sondaggio vuoto oppure caricando un file contenente i dati di un sondaggio in corso. Questi sondaggi "in sospeso" potranno essere cancellati oppure presentati agli amministratori per essere accettati nel sistema o rifiutati. I dati inseriti dei sondaggi in sospeso non saranno visibili agli altri utenti e non saranno neanche considerati dal sistema fino a quando non verranno approvati da un utente amministratore.
- Come sodaggista voglio creare o caricare dei nuovi sondaggi, così da iniziare un nuovo sondaggio
- Come sondaggista voglio modificare i sondaggi, così da aggiungere nuovi voti o modificare gli errori
- Come sondaggista voglio eliminare i sondaggi, così da rimuovere sondaggi creati per errore

### RF 11 Svolgimento sondaggi
Il sistema deve permettere ai sondaggisti di aggiungere o rimuovere i voti ai sondaggi in sospeso. Tramite una pagina apposita, sarà possibile inserire o eliminare nuovi voti, aggiungendo informazioni sulla circoscrizione di appartenenza e a scelta volontaria del cittadino la propria età.
- Come sondaggista voglio creare nuovi voti, così da permettere al cittadino di espriere il proprio grado di soddisfazione
- Come sondaggista voglio eliminare i voti di un sondaggio, così da poter correggere eventuali errori

### RF 12 Modifica Homepage
Per gli utenti: analista, circoscrizione e amministratore, all'interno della Homepage verrà fornita la possibilità di visualizzare una tabella contenente le informazioni più importanti dei vari quartieri (Nome, percentuale di soddisfazione, numero di abitanti) al posto della mappa, sarà inoltre possibile passare dalla visualizzazione della mappa a quella della tabella (o viceversa) attraverso l'utilizzo di un pulsante di selezione.
- Come analista, circoscrizione o amministratore voglio visualizzare i quartieri sotto forma di tabella, così da avere una visualizzazione ordinata secondo i propri criteri dei vari quartieri
- Come analista, circoscrizione o amministratore voglio passare dalla visualizzazione tramite tabella a quella tramite mappa, così da avere una migliore visione di insieme della soddisfazione cittadina

### RF 13 Accesso come analista, circoscrizione o amministratore
Successivamente al processo di autenticazione per gli utenti: analista, circoscrizione e amministratore, verranno reindirizzati alla Homepage modificata con la visualizzazione della città sotto forma di tabella.
- Come analista, circoscrizione o amministratore voglio visualizzare subito la Homepage modificata con la visualizzazione tramite tabella, così da poter avere fin da subito la visione della situazione cittadina senza dover cambiare pagina

### RF 14 Visualizzazione dati analista
Il sistema deve permettere agli analisti di visualizzare, quando si accede ai sigoli quartieri, una visione più specifica dei dati. Per semplificare il più possibile l'interfaccia verrà fornito un raggruppamento dei dati per tipologia. Dovrà inoltre essere possibile selezionare la tipologia di informazioni permettendo una visualizzazione settoriale e specifica del quartiere in questione.
- Come analista voglio accedere ad una quantità maggiore di dati, così da poter avere una migliore idea delle cause dell'insoddisfazione del quartiere analizzato
- Come analista voglio cambiare settore di visualizzazione delle informazioni, così da visualizzare i dati di interesse dell'utente