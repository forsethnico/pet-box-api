const express = require("express");
const cors = require("cors");
const app = express();

app.set("port", process.env.PORT || 3000);
app.locals.title = "Pet Box";
app.use(express.json());
app.use(express.static('public'))
app.use(cors())

app.get("/", (request, response) => {
  response.send("Oh hey Pet Box");
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});

app.locals.pets = [
  { id: "a1", name: "Jessica", type: "dog" },
  { id: "b2", name: "Marcus Aurelius", type: "parakeet" },
  { id: "c3", name: "Craisins", type: "cat" },
];

app.get("/api/v1/pets", (request, response) => {
  const pets = app.locals.pets;
  response.json({ pets });
});

app.get("/api/v1/pets/:id", (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find((pet) => pet.id === id);
  if (!pet) {
    return response.sendStatus(404);
  }
  response.status(200).json(pet);
});

app.post("/api/v1/pets", (request, response) => {
  const id = Date.now();
  const pet = request.body;
  for (let requiredParameter of ["name", "type"]) {
    if (!pet[requiredParameter]) {
      response.status(422).send({
        error: `Expected format: {name: <String>, type: <String>}. You're missing a "${requiredParameter}" property.`,
      });
    }
  }
  const { name, type } = pet;
  app.locals.pets.push({ id, name, type });
  response.status(201).json({ id, name, type });
});

app.patch("/api/v1/pets/:id", (request, response) => {
  const { id } = request.params;
  const index = app.locals.pets.findIndex((pet) => pet.id === id);
  const newPet = request.body;
  if (index >= 0) {
    if (newPet.name) {
      app.locals.pets[index].name = newPet.name;
    }
    if (newPet.type) {
      app.locals.pets[index].type = newPet.type;
    }
    response.status(201).json(app.locals.pets[index]);
  } else {
    response.status(422).send({
      error: `That pet cannot be found!`,
    });
  }
});

app.delete("/api/v1/pets/:id", (request, response) => {
  const { id } = request.params;
  const pets = app.locals.pets;
  const index = pets.findIndex((pet) => pet.id === id);
  if (index >= 0) {
    pets.splice(index, 1);
    response.status(201).json({ pets });
  } else {
    response.status(422).send({
      error: `That pet cannot be found!`,
    });
  }
});


