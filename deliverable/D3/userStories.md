# Requisiti funzionali

### RF 1 Visualizzazione città
Il sistema deve permettere a tutti gli utenti di visualizzare gli attributi demografici e riguardanti la soddisfazione della città. A fianco degli attributi sarà inoltre presente la mappa, con focus sulla città divisa per zone colorate in base al relativo grado di soddisfazione media e i relativi pulsanti per modificarne le impostazioni. Nel caso in cui l'utente fosse autenticato come utente analista sarà inoltre possibile sostituire alla mappa una tabella contenente le zone nelle quali è divisa la città.
- Come utente voglio poter visualizzare gli attributi demografici e riguardanti la soddisfazione della città, così da poter avere delle informazioni dettagliate della città che sto visualizzando
- Come utente voglio visualizzare la mappa del comune di Trento divisa per zone, così da porter distinguere la divisione delle varie aree della città e il grado di soddisfazione medio che vi è in esse

### RF 2 Interazione con la mappa
 Il sistema deve permettere a tutti gli utenti di muovere, interagire e modificare la visualizzazione della mappa. In particolare deve essere possibile modificare il focus centrale della mappa trascinando il cursore, deve essere possibile modificare lo zoom attraverso la rotella del mouse oppure attraverso i pulsanti presenti nell'angolo della mappa, deve essere possibile interagire con le varie zone cliccando sulle stesse. Infine deve essere possibile, quando si è all'interno della "visualizzazione città", modificare la tipologia di zona con la quale si può interagire sulla mappa oppure, nel caso in cui si avesse i permessi da analista, cambiare la visualizzazione da mappa a tabella.
- Come utente voglio poter spostare il focus della mappa, così da poter cambiare l'area geografica che si sta visualizzando
- Come utente voglio poter ingrandire o rimpicciolire la mappa, così da poter avere una visione più chiara dell'area geografica che sto visualizzando
- Come utente voglio poter selezionare una zona della città, così da poter ricevere informazioni più dettagliate riguardanti tale zona
- Come utente voglio poter cambiare la tipologia di zona con la quale si può interagire sulla mappa, così da poter ricevere informazioni riguardanti l'area geografica di preferenza senza complicare l'utlizzo della mappa
- Come utente analista voglio poter visualizzare le zone della città attraverso una tabella, così da poter visualizzare le zone geografiche attraverso l'ordinamento di preferenza

### RF 3 Visualizzazione zona
Il sistema deve permettere a tutti gli utenti di visualizzare gli attributi demografici, gli attributi riguardanti la soddisfazione, e gli attributi riguardanti i servizi forniti della zona selezionata (circoscrizione o quartiere). A fianco degli attributi sarà inoltre presente la mappa, con focus sulla zona di selezione, divisa per zone colorate in base al relativo grado di soddisfazione. Saranno inoltre visualizzati ai vari angoli della mappa i relativi pulsanti per modificarne le impostazioni.o
- visualizzare gli attributi, demografici e riguardanti la soddisfazione, oltre ai servizi forniti della zona selezionata, così da poter ricevere informazioni demografiche e riguardanti la soddisfazione base e informazionei riguardanti i servizi offerti al cittadino da parte della zona selezionata
- Come utente voglio avere una visualizzazione più dettagliata della zona selezionata e del suo circondario, così da avere una visione più dettagliata di essa e del suo circondario, nonchè per poter navigare più velocemente nelle zone circostanti

### RF 6 Login (Leggermente Rivisitata)
Il sistema deve permettere a tutti gli utenti loggati di accedere al loro account premendo il tasto di login presente all'interno della header, il processo di login sarà possibile attraverso l'inserimento di: "Nome Utente" e "Password". Successivamente al processo di autenticazione l'utente verrà reindirizzato alla visualizzazione della città e verrà sostituita l'icona del login con l'icona corrispondente a quella del profilo dal quale si è fatto l'accesso.
- Come utente non loggato voglio poter accedere tramite Nome Utente e Password, così da poter avere accesso alle funzionalità fornite dall'account al quale voglio fare l'accesso

### RF 7 Logout
Il sistema deve permettere a tutti gli utenti loggati di scollegarsi dall'account al quale sono attualmente collegati, riportando così l'utente allo stato di utente non loggato e reindirizzandolo alla "visualizzazione città". Sarà possibile eseguire il logout attraverso il menù a tendina presente nella header.
- Come utente loggato voglio poter scollegare l'account al quale sono attualmente collegato, così da non permettere ad altre persone di accedere al mio account o così da potermi collegare con un'altro account

### RF 8 Visualizzazione sondaggi
Il sistema deve permettere agli utenti sondaggisti di visualizzare in sezioni distinte le liste dei propri sondaggi e le interfacce per l'aggiunta di sondaggi. In particolare il sistema deve presentare in due liste distinte i sondaggi non ancora caricati a sistema e quelli caricati a sistema, inoltre a fianco delle due liste sarà presente l'interfaccia per creare o caricare nuovi sondaggi.
- Come sondaggista voglio poter visualizzare i vari sondaggi con la descrizione ed il relativo stato di completamento, così da poter distinguere lo stato dei vari sondaggi e così da definire quali di questi sono stati completati, quali sono da finire, quali da modificare e quali da eliminare

### RF 9 Gestione sondaggi
Il sistema deve permettere agli utenti sondaggisti di aggiungere, continuare, eliminare, salvare e completare i sondaggi non ancora caricati a sistema. In particolare deve essere possibile aggiungere un sondaggio creandone uno nuovo oppure caricandone uno, deve essere possibile continuare a modificare un sondaggio selezionandone uno dall'apposita visualizzazione sondaggi e infine deve essere possibile eliminare, salvare e inviare un sondaggio, con tutti i voti annessi ad esso, premendo gli appositi pulsanti presenti all'interno dell'interfaccia.
- Come sondaggista voglio poter aggiungere i sondaggi, così da poter cominciare un sondaggo
- Come sondaggista voglio poter continuare i sondaggi non ancora completati, così da poter continuare ad aggiungere nuovi voti oppure per poter modificare degli errori
- Come sondaggista voglio poter eliminare i sondaggi, così da poter rimuovere sondaggi sbagliati o creati per errore
- Come sondaggista voglio poter salvare i sondaggi in corso, così da poter continuare in un secondo momento a modificare i sondaggi in corso
- Come sondaggista voglio poter completare i sondaggi in corso, così da poter caricare a sistema i sondaggi che si ha completato

### RF 10 Visualizzazione voti
Il sistema deve permettere agli utenti sondaggisti di visualizzare in sezioni distinte i dati relativi ai voti già inseriti all'interno di un sondaggio in corso, le interfacce per la gestione dei voti di sondaggi e le interfacce per la gestione del sondaggio. In particolare il sistema deve presentare una sezione contenente le statistiche parziali generali e quelle relative ai vari quartieri, deve presentare la lista contenente i voti precedenti e le interfacce per gestire i voti e il sondaggio.
- Come sondaggista voglio poter visualizzare le statistiche parziali dei voti, così da poter visualizzare il quantitativo di voti all'interno del sondaggio e lo svolgimento in modo corretto dei voti
- Come sondaggista voglio poter visualizzare le interfacce per la gestione dei voti, così da poter controllare il corretto andamento delle votazioni

### RF 11 Gestione voti
Il sistema deve permettere agli utenti sondaggisti di aggiungere o rimuovere i voti dai sondaggi in sospeso, ciò sarà possibile attraverso due apposite interfacce. Per aggiungere i voti sarà necessario inserire il quartiere di residenza del cittadino e, a scelta volontaria dello stesso, la sua fascia d'età. Premendo il pulsante apposito il sistema caricherà dunque l'interfaccia necessaria per il voto, completando e inviando il voto il processo di aggiunta voto sarà dunque finito. Per eliminare i voti basterà invece premere il pulsante apposito sul voto presente nella apposita lista.
- Come sondaggista voglio poter aggiungere un voto al sondaggio in corso, così da permettere al cittadino di espriere il proprio grado di soddisfazione rispetto alle attività del comune per la zona nella quale abita e per la sua città
- Come sondaggista voglio poter eliminare i voti di un sondaggio, così da poter correggere eventuali voti errati

### RF 12 Interazione con la tabella
Il sistema deve permettere agli utenti analisti di muovere, interagire e modificare la visualizzazione della tabella. In particolare deve essere possibile modificare il focus principale della tabella attraverso la rotella del mouse oppure attraverso la barra presente a lato della tabella, deve essere possibile interagire con le varie zone cliccando sul nome delle stesse e deve infine essere possibile, quando si è all'interno della visualizzazione della città, cambiare la visualizzazione da tabella a mappa.
- Come analista voglio poter modificare il focus principale della tabella, così da poter visualizzare i dati appartenenti a zone non visibili in tabella
- Come analista voglio poter interagire con la tabella, così da poter selezionare la zona di interesse
- Come analista voglio passare dalla visualizzazione tramite tabella a quella tramite mappa, così da avere una migliore visione di insieme della distribuzione della soddisfazione all'interno della città

### RF 13 Accesso completo agli attributi
 Il sistema deve permettere agli utenti analisti di avere accesso ad un maggior numero di attributi e ad una categorizzazione di essi in base all'area tematica degli stessi. In particolare deve essere possibile, ogni volta che un utente analista si trova all'interno della "visualizzazione zona", visualizzare tutte le diverse categorie di attributi relativi a tale zona. Deve infine essere possibile selezionare la categoria della quale si vuole visualizzare gli attributi permettendo una visualizzazione settoriale e specifica del quartiere in questione.
- Come analista voglio poter visualizzare un maggior numero di attributi appartenenti ad una data zona geografica, così da poter comprendere a fondo le motivazione di un corrispettivo livello di soddisfazione
- Come analista voglio poter categorizzare gli attributi appartenenti alla singola zona, così da poter confrontare assieme dati che hanno una correlanza tra gli stessi