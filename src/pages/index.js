import Head from 'next/head'
import styles from '../styles/App.module.css'
import { useState } from 'react'

const InitialScreen = (props) => 
    (
    <div className={styles.input_container}>
      <i className={`fa fa-user ${styles.input_icon}`}></i>
      <input className={styles.input_field} type="text" id="name" name="name" onChange={props.onChangeName} required={true} placeholder="Digite seu nome..." /> 
      <button disabled={props.btnDisabled} onClick={props.fetchCards(5)} className={styles.btn}>Ver Cartas</button>
    </div>
    )

const CardsScreen = (props) => (
  <div>
    <div className={styles.user_name}>Usuário: {props.name}</div>

    <div className={styles.input_container}>
      <button className={styles.btn} onClick={props.fetchNewCard}>Puxar uma nova carta</button>
      <button className={styles.btn} onClick={props.shuffleCards}>Embaralhar</button>
    </div>

    <div className={styles.row}>
      {props.cards.map((card) => (
        <div key={card.key} className={styles.column}>
          <div className={styles.card}>
            <p><b>ID:</b> {card.id}</p>
            <h4><b>Nome:</b> {card.name}</h4>
            <p><img src={card.image} width={300} height={300} /></p>
            <p>{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default () => {
  const [name, setName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [startScreen, setStartScreen] = useState(true);
  const [cards, setCards] = useState([])
  const [attempts, setAttempts] = useState(1)

  const onChangeName = (e) => {
    if(e.target.value) {
      setBtnDisabled(false);
      setName(e.target.value);
    }else{
      setBtnDisabled(true);
    }
  }

  const fetchCards = (number) => {
   return async () => {
    let response = await fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify({name, number})
    });

    response = await response.json();

    setStartScreen(false);
    setCards(response.animals);
   }
  }

  const shuffleCards = (e) => {    
    setCards((animals) => animals.sort(() => Math.random() - 0.5).map((a) => {
      return {
        key: parseInt(a.key) + 1,
        id: a.id,
        name: a.name,
        image: a.image,
        description: a.description
      }
    }));
   }

   const fetchNewCard = async(e) => {
    if(attempts <= 3) {
      let response = await fetch("/api/cards", {
        method: "POST",
        body: JSON.stringify({name, number: 1})
      });
  
      response = await response.json();
  
      setCards((animals) => [...animals, response.animals[0]]);
      setAttempts((attempts) => attempts + 1)
    }
    else{
      alert("Limite de 3 atingido");
    }
   }

  return (
    <div className={styles.main_container}>
      <Head>
        <title>Cards</title>
        <meta name="description" content="Cards App" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Cards App
        </h1>

        {startScreen ? 
        <InitialScreen btnDisabled={btnDisabled} onChangeName={onChangeName} fetchCards={fetchCards}  /> : 
        <CardsScreen name={name} cards={cards} shuffleCards={shuffleCards} fetchNewCard={fetchNewCard} />}
        
      </main>
    </div>
  )
}
