CREATE TABLE users (
    user_id integer auto_increment,
    name text not null,
    email text not null,
    password text not null,
    role integer not null,
    primary key (user_id),
    unique (email)
);