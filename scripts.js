const URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20';
const BASE_URL_TYPE = 'https://pokeapi.co/api/v2/type/';
const BASE_URL_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';

const boton = document.querySelector('.btnPokemon');
boton.addEventListener('click', function() {
    getPokemons(URL);
});

const getPokemons = async (url) => {
    const pokemonList = await fetch(url);
    const pokemonListJSON = await pokemonList.json();
    agregarFuncionalidadBotones(pokemonListJSON.next, pokemonListJSON.previous);

    const cardsContainer = document.querySelector('#pokemon-cards');
    cardsContainer.innerHTML = ''; 

    pokemonListJSON.results.forEach(async (pokemon) => {
        if (pokemon) {
            await setDataInCard(pokemon.url);
        }
    });
};

const agregarFuncionalidadBotones = (URLnext, URLprevious) => {
    const btnAnterior = document.querySelector('.anterior');
    const btnSiguiente = document.querySelector('.siguiente');

    if (URLnext) {
        btnSiguiente.style.display = 'block';
        btnSiguiente.onclick = () => getPokemons(URLnext);
    } else {
        btnSiguiente.style.display = 'none';
    }

    if (URLprevious) {
        btnAnterior.style.display = 'block';
        btnAnterior.onclick = () => getPokemons(URLprevious);
    } else {
        btnAnterior.style.display = 'none';
    }
};
const getPokemonByType = async (tipo) => {
    const url = `${BASE_URL_TYPE}${tipo}`;
    const pokemonList = await fetch(url);
    const pokemonListJSON = await pokemonList.json();

    const cardsContainer = document.querySelector('#pokemon-cards');
    cardsContainer.innerHTML = ''; 

    const pokemons = pokemonListJSON.pokemon.slice(0, 20);

    pokemons.forEach(async (pokemonData) => {
        const pokemonURL = pokemonData.pokemon.url;
        await setDataInCard(pokemonURL);
    });
};

const botonesTipo = document.querySelectorAll('.btnTipo');
botonesTipo.forEach(boton => {
    boton.addEventListener('click', function() {
        const tipo = this.getAttribute('data-tipo');
        getPokemonByType(tipo);
    });
});

const setDataInCard = async (urlData) => {
    try {
        const dataPokemon = await fetch(urlData);
        const dataPokemonJSON = await dataPokemon.json();

        const cardsContainer = document.querySelector('#pokemon-cards');

        const colDiv = document.createElement('div');
        colDiv.classList.add('col-md-4', 'animate__animated', 'animate__fadeInUp');

        const card = document.createElement('div');
        card.classList.add('card', 'mb-4');

        const img = document.createElement('img');
        img.src = dataPokemonJSON.sprites.front_default || 'https://via.placeholder.com/150';
        img.classList.add('card-img-top', 'pokemon-img-hover');
        img.alt = `Imagen de ${dataPokemonJSON.name}`;

        
        img.addEventListener('mouseover', function() {
            img.classList.add('animate__animated', 'animate__pulse');
        });

        img.addEventListener('mouseout', function() {
            img.classList.remove('animate__animated', 'animate__pulse');
        });
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = dataPokemonJSON.name;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = `Experiencia: ${dataPokemonJSON.base_experience}`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(img);
        card.appendChild(cardBody);
        colDiv.appendChild(card);
        cardsContainer.appendChild(colDiv);

    } catch (error) {
        console.log('Error al cargar los datos del Pokémon:', error);
    }
};

const btnBuscar = document.querySelector('#btnBuscar');
btnBuscar.addEventListener('click', function() {
    const nombrePokemon = document.querySelector('#buscarPokemon').value.toLowerCase();
    if (nombrePokemon) {
        buscarPokemonPorNombre(nombrePokemon);
    }
});

const buscarPokemonPorNombre = async (nombrePokemon) => {
    try {
        const url = `${BASE_URL_POKEMON}${nombrePokemon}`;
        const dataPokemon = await fetch(url);
        if (!dataPokemon.ok) {
            throw new Error('No se encontró el Pokémon');
        }

        const dataPokemonJSON = await dataPokemon.json();
        const cardsContainer = document.querySelector('#pokemon-cards');
        cardsContainer.innerHTML = ''; 

        await setDataInCard(url);

    } catch (error) {
        console.log('Error al buscar el Pokémon:', error);
        alert('No se encontró el Pokémon con ese nombre');
    }
};