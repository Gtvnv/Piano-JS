# 🎹 Simulador de Piano

Simulador de piano feito com **HTML, CSS e JavaScript puro**. O som é
sintetizado em tempo real pela **Web Audio API**, então o projeto não depende
de nenhum arquivo de áudio externo — basta abrir no navegador e tocar.

## ✨ Funcionalidades

- Uma oitava completa (Dó a Dó²) com teclas brancas e pretas.
- Som gerado via Web Audio API com envelope suave (sem "cliques").
- Toque com o **mouse** ou com o **teclado do computador**.
- Controle de **volume**.
- Opção de **mostrar/ocultar** os nomes das notas e as teclas do teclado.
- Layout responsivo.

## ⌨️ Mapa do teclado

| Nota | Tecla | | Nota | Tecla |
|------|-------|---|------|-------|
| Dó   | `A`   | | Fá#  | `T`   |
| Dó#  | `W`   | | Sol  | `G`   |
| Ré   | `S`   | | Sol# | `Y`   |
| Ré#  | `E`   | | Lá   | `H`   |
| Mi   | `D`   | | Lá#  | `U`   |
| Fá   | `F`   | | Si   | `J`   |
|      |       | | Dó²  | `K`   |

## 🚀 Como executar

Abra o arquivo `index.html` em qualquer navegador moderno.

> Dica: por exigência dos navegadores, o áudio só é inicializado após a
> primeira interação do usuário (clique ou tecla).

## 🗂️ Estrutura

```
Piano_JavaScript/
├── index.html   # estrutura da página
├── styles.css   # estilos e layout do piano
├── script.js    # geração das teclas, áudio e interações
└── README.md
```

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Web Audio API

---

Projeto desenvolvido como desafio de prática.
