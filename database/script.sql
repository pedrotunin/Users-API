CREATE TABLE users (
    user_id integer auto_increment,
    name text not null,
    email text not null,
    password text not null,
    role integer not null,
    primary key (user_id),
    unique (email)
);

CREATE TABLE password_tokens (
    token_id integer auto_increment,
    user_id integer,
    token text not null,
    used boolean not null,
    max_age timestamp not null,
    primary key (token_id),
    foreign key (user_id) references users(user_id)
);