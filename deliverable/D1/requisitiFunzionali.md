# Requisiti funzionali 
## Per tutti gli utenti
- RF1: L'utente deve essere in grado di visualizzare la mappa del comune divisa per quartieri
- RF2: Devono essere presenti dei pulsanti per cambiare lingua su tutte le pagine del sistema, selezionando tra italiano, tedesco, e inglese
- RF3: L'utente deve poter cliccare sui vari quartieri potendo andare a visualizzare i dati generici (num popolazione, felicità, età media, servizi)
- RF4:  I dati dei vari quartieri saranno visualizzabili in modo più esteso quando vi ci viene cliccato sopra fornendo per esempio il numero di tali servizi nel quartiere o volendo una lista di tali edifici 

## Per tutti gli utenti loggati
- RF5: Tutti gli utenti loggati possono accedere tramite SPID/CIE/CNS/CPS al sistema e possono eseguire il log-ou

## Per gli analisti 
- RF6: Avranno la possibilità di visualizzare i dati come tabella con possibilità di ordinamento e filtro.
- RF7: Avranno la possibilità di visualizzare lo storico dei dati tramite grafici

## Per i sondaggisti
- RF8: Saranno in grado di aggiungere i dati relativi ai sondaggi eseguiti sul territorio comunale
- RF9: Potranno modificare e/o eliminare i dati inseriti da loro stessi fino a quando non vengono approvati da un amministratore
- RF10: Potranno vedere un elenco dei sondaggi effettuati da loro stessi con lo stato di approvazione

## Per gli amministratori
- RF11: Avranno la possibilità di approvare/scartare e eliminare i dati inseriti dai sondaggisti
- RF12: Avranno la possibilità di aggiungere, modificare e eliminare i dati relativi ai servizi presenti sul territorio comunale
- RF13: Avranno la possibilità di aggiungere, modificare e eliminare gli utenti abilitati al sistema


# Requisiti non funzionali
- RNF1: La web app deve essere compatibile con le seguenti versioni di browser: Chrome 80+, Firefox 80+, Safari 14+, Edge 80+ fornendo a ciascuna una pari esperienza per quanto riguarda il numero delle funzionalità disponibili
- RNF2: Il sistema deve essere in grado di fornire i dati richiesti all’utente entro 2 secondi dalla loro rischesta
- RNF3: Il sistema deve riuscire a gestire almeno 1000 utenti connessi simultaneamente, senza che nessuna funzionalità sia compromessa
- RNF4: I dati non accessibili a tutti dovranno essere memorizzati in modo sicuro e protetti tramite protocollo HTTPS e autenticazione per le richieste client-server
- RNF5: Progettazione di un piano di backup dei dati in modo sicuro su un server locale interno all'edificio (6h/12h/1d) e un backup meno frequente remoto (1d/3d/1w)
- RNF6: Il sistema deve permettere ai Sondaggisti di caricare anche quantità di dati con unità di misura del Gigabyte in meno di 10 minuti
- RNF7: Il sistema deve permettere di aggiungere/modificare/eliminare i dati regolarmente mantenendo una struttura logica intatta
- RNF8: I dati sulla felicità caricati hanno validità massima di circa 6 mesi al fine di mantenerli attuali
- RNF9: Il sistema farà uso di un design accessibile tramite una navigazione tramite topbar accessibile sia da schermi con risoluzione desktop, laptop e tablet
- RNF10: La parte grafica generale deve essere di facile utilizzo per tutti gli utenti, la parte della web-app disponibile a tutti gli utenti deve essere comprensibile fin dal primo utilizzo ed entro 10 minuti dovrebbe essere chiaro a chiunque come funzioni l'app nella sua interezza
- RNF11: La lingua selezionata inizialmente deve essere l'italiano, però devono essere disponibili anche la lingua inglese e tedesca