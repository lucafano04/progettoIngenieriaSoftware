# Requisiti funzionali

### RF 1 Mappa
Il sistema deve permettere a tutti gli utenti di visualizzare integralmente i dati generici e la mappa del comune di Trento divisa per quartieri non appena si apre la web-app. Ogni utente deve essere in grado di interagire con la mappa, in particolare deve essere possibile: ingrandire, rimpicciolire e spostarsi all'interno di essa tramite il mouse o i pulsanti a schermo.
- Come utente voglio visualizzare la mappa del comune di Trento divisa per quartieri, così da porter avere una migliore visione d'insieme della regione di spazio considerata
- Come utente voglio poter ingrandire o rimpicciolire la mappa, così da poter avere una visuale migliore dell'area che voglio visualizzare
- Come utente voglio poter spostare il focus della mappa, così da poter cambiare l'area che si sta visualizzando

### RF 3 Selezione zona della città
Il sistema deve permettere a tutti gli utenti di selezionare una qualunque delle varie zone della città (quartiere o circoscrizione). Selezionare un zona consentirà all'utente di visualizzare i dati generici (num popolazione, soddisfazione, età media, servizi) relativi ad essa. Inoltre la mappa visualizzata sposterà il focus e si ingrandirà sulla zona di interesse. Quando una zona è selezionata questa verrà evidenziata, sarà inoltre possibile de-selezionarla cliccando nuovamente sulla stessa o cliccando su di un'altra zona. Nel caso in cui non fosse stata selezionata una zona specifica o ne venisse deselezionata una la visualizzazione diverrebbe quella della Homepage principale.
- Come utente voglio poter selezionare una zona della città, così da poter ricevere informazioni più dettagliate di tale zona
- Come utente voglio avere una visualizzazione più dettagliata della zona selezionata e del suo circondario, così da avere una visione più dettagliata di essa e così da potermi muovere direttamente anche nelle zone circostanti
- Come utente voglio poter tornare alla visualizzazione integrale della mappa, così da poter cambiare la zona selezionata

### RF 7 Autenticazione (Leggermente Rivisitata)
Il sistema deve permettere a tutti gli utenti loggati di accedere al loro account premendo un tasto di login in altro a destra, il quale renderizzerà gli utenti alla pagina di login attraverso l'inserimento di: "Nome Utente" e "Password". Nel caso in cui l'utente non avesse un ruolo abilitato questo verrà reindirizzato alla pagina principale con un messaggio di errore tramite pop-up che informerà dei mancati permessi per accedere al sistema.
- Come utente voglio poter accedere tramite Nome Utente e Password, così da poter avere accesso alle funzionalità fornite all'utente

### RF 6 Cambio icona login
Successivamente al processo di autenticazione per qualsiasi utente loggato verrà sostituita l'icona del login con l'immagine del profilo con il quale si è fatto l'accesso.
- Come utente loggato voglio poter visualizzare l'immagine del profilo, così da essere sicuro di aver effettuato l'accesso con l'account giusto

### RF 7 Visualizzazione dati sondaggisti
Il sistema deve permettere ai sondaggisti di visualizzare tramite una pagina dedicata l'interfaccia per gestire i sondaggi. In questa interfaccia deve essere presente una tabella contenente il riassunto dei dati relativi ai sondaggi inseriti da loro stessi con relativo stato di approvazione e nel caso in cui non fossero ancora stati approvati saranno inoltre disponibili anche dei pulsanti per eliminare e/o modificare i dati inseriti.
- Come sondaggista voglio visualizzare i vari sondaggi con il relativo stato di approvazione, così da poter sapere quali sondaggi sono da finire, quali da modificare o quali da cancellare
- Come sondaggista voglio eliminare i sondaggi, così da poter rimuovere sondaggi creati per errore
- Come sondaggista voglio modificare i sondaggi, così da poter aggiungere nuovi voti o modificare gli errori

### RF 8 Accesso come sondaggista
Il sistema successivamente al processo di autenticazione reindirizzerà automaticamente i vari account sondaggisti alla corrispettiva pagina dedicata, così facendo verrà velocizzata e semplificata la procedura d'accesso limitando inoltre le funzionalità fornite ai sondaggisti.
- Come sondaggista voglio visualizzare subito l'interfaccia per gestire i sondaggi, così da poter iniziare, modificare o eliminare i sondaggi senza dover cambiare pagina

### RF 9 Creazione nuovi sondaggi
Il sistema deve permette ai sondaggisti di creare nuovi sondaggi. Questo deve essere possibile attraverso due modalità: creando un nuovo sondaggio oppure caricando un file contenente i dati di un sondaggio in corso. Questi sondaggi "in sospeso" potranno essere cancellati oppure presentati agli amministratori per essere successivamente valutati. I dati inseriti dei sondaggi in sospeso non saranno visibili agli altri utenti e non saranno considerati dal sistema fino a quando non verranno approvati da un utente amministratore. In caso di rifiuto da parte di un utente amministratore il sondaggio in questione tornerà in stato "sospeso".
- Come sodaggista voglio creare o caricare dei nuovi sondaggi, così da iniziare o continuare un sondaggio
- Come sondaggista voglio che i sondaggi rifiutati dagli amministratori tornino in stato "sospeso", così da poter sistemare gli eventuali errori e successivamente ripresentare il sodaggio agli amministratori

### RF 10 Svolgimento sondaggi
Il sistema deve permettere ai sondaggisti di aggiungere o rimuovere i voti ai sondaggi in sospeso. Tramite una pagina apposita, sarà possibile inserire o eliminare nuovi voti, aggiungendo informazioni sulla circoscrizione di appartenenza e a scelta volontaria del cittadino la propria età.
- Come sondaggista voglio creare nuovi voti, così da permettere al cittadino di espriere il proprio grado di soddisfazione
- Come sondaggista voglio eliminare i voti di un sondaggio, così da poter correggere eventuali errori

### RF 11 Modifica Homepage
Per gli utenti: analista, circoscrizione e amministratore, all'interno della Homepage verrà fornita la possibilità di visualizzare una tabella contenente le informazioni più importanti delle varie zone della città (Nome, percentuale di soddisfazione, numero di abitanti) al posto della mappa, sarà inoltre possibile passare dalla visualizzazione della mappa a quella della tabella (o viceversa) attraverso l'utilizzo di un pulsante di selezione.
- Come analista, circoscrizione o amministratore voglio visualizzare le zone cittadine sotto forma di tabella, così da avere una visualizzazione ordinata secondo i propri criteri delle varie zone
- Come analista, circoscrizione o amministratore voglio passare dalla visualizzazione tramite tabella a quella tramite mappa, così da avere una migliore visione di insieme della soddisfazione cittadina

### RF 12 Accesso come analista, circoscrizione o amministratore
Successivamente al processo di autenticazione per gli utenti: analista, circoscrizione e amministratore, verranno reindirizzati alla Homepage modificata con la visualizzazione della città sotto forma di tabella.
- Come analista, circoscrizione o amministratore voglio visualizzare subito la Homepage modificata con la visualizzazione tramite tabella, così da poter avere fin da subito la visione della situazione cittadina senza dover cambiare pagina

### RF 13 Visualizzazione dati analista
Il sistema deve permettere agli analisti di visualizzare, quando si accede alle singole zone, una visione più specifica dei dati. Per semplificare il più possibile l'interfaccia verrà fornito un raggruppamento dei dati per tipologia. Dovrà inoltre essere possibile selezionare la tipologia di informazioni permettendo una visualizzazione settoriale e specifica del quartiere in questione.
- Come analista voglio accedere ad una quantità maggiore di dati, così da poter avere una migliore idea delle cause dell'insoddisfazione del quartiere analizzato
- Come analista voglio cambiare settore di visualizzazione delle informazioni, così da visualizzare i dati di interesse dell'utente