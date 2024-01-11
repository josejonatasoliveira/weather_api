**README.md**

# Weather API

## Sumário

- [Objetivos](#objetivos)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Docker](#docker)

  ![Home Screen](https://github.com/josejonatasoliveira/weather_api/blob/master/images/home.png)


## Objetivos
O objetivo desta API é consultar a previsão do tempo para os próximos 5 dias. Foi-se utilizado a api da openweathermap.org. 

## Requisitos

Certifique-se de ter o Python instalado com uma versão maior que 3.8. Você pode instalar os requisitos executando:

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/josejonatasoliveira/weather_api.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd weather_api
   ```
3. Crie um ambiente virtual:
    ```bash
   python -m venv .env
   ```

    Ative o ambiente virtual

   ```bash
   .env\\Scripts\\activate.bat
   ```

4. Instale os requisitos:

   ```bash
   pip install -r requirements.txt
   ```

5. Migre as tabelas padrões do Django

   ```bash
   python manage.py migrate
   ```


##  Docker
Para instalar via docker para executar o seguinte comando dentro da pasta `weather_api`.

```bash
   docker-compose up --build
```

Após a execução destes comandos a api estará rodando na porta 8040 do localhost.
http://localhost:8040