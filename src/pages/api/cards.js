function post(req, res) {
  const body = JSON.parse(req.body)

  fetchAnimals(body.number).then((animals) => {
    res.status(200).json({
      name: body.name,
      animals: animals,
    })
  })
}

function fetchAnimals(number) {
  return fetch(`https://zoo-animal-api.herokuapp.com/animals/rand/${number}`)
    .then((resp) => resp.json())
    .then((res) =>
      res.map((animal) => {
        return {
          id: animal.id,
          name: animal.name,
          image: animal.image_link,
          description: animal.animal_type,
          points: randomIntFromInterval(0, 10),
        }
      }),
    )
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const CardsAPI = (req, res) => {
  if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).send()
  }
}

export default CardsAPI
