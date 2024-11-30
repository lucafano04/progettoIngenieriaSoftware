# Requisiti funzionali

### RF 1 Visualizzazione città
Il sistema deve permettere a tutti gli utenti di poter visualizzare gli attributi demografici e riguardanti la soddisfazione della città. A fianco degli attributi sarà inoltre presente la mappa con focus sulla città divisa per zone colorate in base al relativo grado di soddisfazione media e i relativi pulsanti per modificarne le impostazioni.
- Come utente voglio poter visualizzare gli attributi demografici e riguardanti la soddisfazione della città, così da poter avere delle informazioni dettagliate della città che sto visualizzando
- Come utente voglio visualizzare la mappa del comune di Trento divisa per zone, così da porter distinguere la divisione delle varie aree della città e il grado di soddisfazione medio che vi è in esse

### RF 2 Interazione con la mappa
 Il sistema deve permettere a tutti gli utenti di poter muovere, interagire e modificare la visualizzazione della mappa. In particolare deve essere possibile modificare il focus centrale della mappa trascinando il cursore, deve essere possibile modificare lo zoom attraverso la rotella del mouse oppure attraverso i pulsanti presenti nell'angolo della mappa, deve essere possibile interagire con le varie zone cliccando sulle stesse e infine deve essere possibile, quando si è all'interno della visualizzazione della città, modificare la tipologia di zona con la quale si può interagire sulla mappa oppure, nel caso in cui si avesse i permessi necessari, si può cambiare la visualizzazione da mappa a tabella e viceversa.
- Come utente voglio poter spostare il focus della mappa, così da poter cambiare l'area geografica che si sto visualizzando
- Come utente voglio poter ingrandire o rimpicciolire la mappa, così da poter avere una visione più chiara dell'area geografica che sto visualizzando
- Come utente voglio poter selezionare una zona della città, così da poter ricevere informazioni più dettagliate riguardanti tale zona
- Come utente voglio poter cambiare la tipologia di zona con la quale si può interagire sulla mappa, così da poter ricevere informazioni riguardanti l'area geografica di preferenza senza complicare l'utlizzo della mappa
- Come utente analista, amministratore e circoscrizione voglio poter visualizzare le zone della città attraverso una tabella, così da poter navigare più velocemente attraverso le varie zone geografiche e così da poter ordinare secondo attributi specifici le varie zone geografiche

### RF 3 Visualizzazione zona
Il sistema deve permettere a tutti gli utenti di poter visualizzare gli attributi, demografici e riguardanti la soddisfazione, oltre ai servizi forniti della zona selezionata (circoscrizione o quartiere). A fianco degli attributi sarà inoltre presente la mappa, con focus sulla zona di selezione, divisa per zone colorate in base al relativo grado di soddisfazione e al focus centrale della mappa, saranno inoltre visualizzati ai vari angoli della mappa i relativi pulsanti per modificarne le impostazioni.
- visualizzare gli attributi, demografici e riguardanti la soddisfazione, oltre ai servizi forniti della zona selezionata, così da poter ricevere informazioni demografiche e riguardanti la soddisfazione base e informazionei riguardanti i servizi offerti al cittadino da parte della zona selezionata
- Come utente voglio avere una visualizzazione più dettagliata della zona selezionata e del suo circondario, così da avere una visione più dettagliata di essa e del suo circondario, nonchè per poter navigare più velocemente nelle zone circostanti

### RF 6 Login (Leggermente Rivisitata)
Il sistema deve permettere a tutti gli utenti loggati di accedere al loro account premendo il tasto di login presente all'interno della header, il processo di login sarà possibile attraverso l'inserimento di: "Nome Utente" e "Password". Nel caso in cui l'utente non avesse un ruolo abilitato questo verrà reindirizzato alla pagina principale con un messaggio di errore tramite pop-up.Successivamente al processo di autenticazione l'utente verrà reindirizzato alla visualizzazione della città e verrà sostituita l'icona del login con l'icona corrispondente a quella del profilo dal quale si è fatto l'accesso.
- Come utente non loggato voglio poter accedere tramite Nome Utente e Password, così da poter avere accesso alle funzionalità fornite dall'account al quale voglio fare l'accesso

### RF 7 Logout
Il sistema deve permettere a tutti gli utenti loggati di potersi scollegare dall'account al quale sono attualmente collegati, riportando così l'utente allo stato di utente non loggato e reindirizzandolo alla visualizzazione della città. Sarà possibile eseguire il logout attraverso il menù a tendina presente nella header.
- Come utente loggato voglio poter scollegare l'account al quale sono attualmente collegato, così da non permettere ad altre persone di accedere al mio account o così da potermi collegare con un'altro account

### RF 8 Visualizzazione sondaggi
Il sistema deve permettere agli utenti sondaggisti di poter visualizzare in sezioni distinte le liste di sondaggi e le interfacce per l'aggiunta di sondaggi. In particolare il sistema deve presentare in due liste distinte i sondaggi non ancora caricati a sistema e quelli caricati a sistema, inoltre a fianco delle due liste sarà presente l'interfaccia per creare o caricare nuovi sondaggi.
- Come sondaggista voglio poter visualizzare i vari sondaggi con la descrizione ed il relativo stato di completamento, così da poter distinguere lo stato dei vari sondaggi e così da definire quali di questi sono stati completati, quali sono da finire, quali da modificare e quali da eliminare

### RF 9 Gestione sondaggi
Il sistema deve permettere agli utenti sondaggisti di poter aggiungere, continuare, eliminare, salvare e completare i sondaggi non ancora caricati a sistema.In particolare deve essere possibile aggiungere un sondaggio creandone uno nuovo oppure caricandone uno, deve essere possibile continuare a modificare un sondaggio selezionandone uno dall'apposita visualizzazione sondaggi e infine deve essere possibile eliminare, salvare e inviare un sondaggio, con tutti i voti annessi ad esso, premendo gli appositi pulsanti presenti all'interno dell'interfaccia.
- Come sondaggista voglio poter aggiungere i sondaggi, così da poter cominciare un sondaggo
- Come sondaggista voglio poter continuare i sondaggi non ancora completati, così da poter continuare ad aggiungere nuovi voti oppure per poter modificare degli errori
- Come sondaggista voglio poter eliminare i sondaggi, così da poter rimuovere sondaggi sbagliati o creati per errore
- Come sondaggista voglio poter salvare i sondaggi in corso, così da poter continuare in un secondo momento a modificare i sondaggi in corso
- Come sondaggista voglio poter completare i sondaggi in corso, così da poter caricare a sistema i sondaggi che si ha completato

### RF 10 Visualizzazione voti
Il sistema deve permettere agli utenti sondaggisti di poter visualizzare in sezioni distinte i dati relativi ai voti già inseriti all'interno del sondaggio in coro, le interfacce per la gestione dei voti di sondaggi e le interfacce per la gestione del sondaggio. In particolare il sistema deve presentare una sezione contenente le statistiche parziali generali e quelle relative ai vari quartieri, deve presentare la lista contenente i voti precedenti e le interfacce per gestire i voti e il sondaggio.
- Come sondaggista voglio poter visualizzare le statistiche parziali dei voti, così da poter visualizzare il quantitativo di voti all'interno del sondaggio e lo svolgimento in modo corretto dei voti
- Come sondaggista voglio poter visualizzare le interfacce per la gestione dei voti, così da poter controllare il corretto andamento delle votazioni

### RF 11 Gestione voti
Il sistema deve permettere agli utenti sondaggisti di aggiungere o rimuovere i voti ai sondaggi in sospeso, ciò sarà possibile attraverso due apposite interfacce. Per aggiungere i voti sarà necessario inserire la circoscrizione di residenza del cittadino e a scelta volontaria dello stesso la propria fascia d'età, premendo il pulsante apposito il sistema caricherà dunque l'interfaccia necessaria per il voto, completando e inviando il voto il processo di aggiunta voto sarà dunque finito. Per eliminare i voti basterà invece premere il pulsante apposito sul voto presente nella apposita lista.
- Come sondaggista voglio poter aggiungere un voto al sondaggio in corso, così da permettere al cittadino di espriere il proprio grado di soddisfazione rispetto alle attività del comune per la zona nella quale abita e per la sua città
- Come sondaggista voglio poter eliminare i voti di un sondaggio, così da poter correggere eventuali voti errati


### Da qua in poi bisogna rivederli


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