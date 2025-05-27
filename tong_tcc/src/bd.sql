-- CREATE TABLE clientes (
--     id_cliente INT PRIMARY KEY AUTO_INCREMENT,
--     nome VARCHAR(100) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     telefone VARCHAR(20),
--     endereco TEXT
-- );

-- CREATE TABLE produtos (
--     id_produto INT PRIMARY KEY AUTO_INCREMENT,
--     nome VARCHAR(100) NOT NULL,
--     descricao TEXT,
--     preco DECIMAL(10,2) NOT NULL,
--     imagem_url VARCHAR(255)
-- );

-- CREATE TABLE pedidos (
--     id_pedido INT PRIMARY KEY AUTO_INCREMENT,
--     id_cliente INT NOT NULL,
--     data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
--     status VARCHAR(50) DEFAULT 'pendente',
--     FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
-- );

-- CREATE TABLE pedido_itens (
--     id_pedido_item INT PRIMARY KEY AUTO_INCREMENT,
--     id_pedido INT NOT NULL,
--     id_produto INT NOT NULL,
--     quantidade INT NOT NULL DEFAULT 1,
--     preco_unitario DECIMAL(10,2) NOT NULL,
--     FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
--     FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
-- );

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT
);

CREATE TABLE adm (
    id_adm INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL
);
CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE produto (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem_url VARCHAR(255),
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE adicional (
    id_adicional INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);

CREATE TABLE produto_adicional (
    id_produto INT,
    id_adicional INT,
    PRIMARY KEY (id_produto, id_adicional),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
    FOREIGN KEY (id_adicional) REFERENCES adicional(id_adicional)
);
CREATE TABLE prod_cli (
    id_cliente INT,
    id_produto INT,
    PRIMARY KEY (id_cliente, id_produto),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);
CREATE TABLE carrinho (
    id_carrinho INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE carrinho_produto (
    id_carrinho INT,
    id_produto INT,
    quantidade INT DEFAULT 1,
    PRIMARY KEY (id_carrinho, id_produto),
    FOREIGN KEY (id_carrinho) REFERENCES carrinho(id_carrinho),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);
CREATE TABLE pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_carrinho INT,
    id_adm INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pendente',
    FOREIGN KEY (id_carrinho) REFERENCES carrinho(id_carrinho),
    FOREIGN KEY (id_adm) REFERENCES adm(id_adm)
);



