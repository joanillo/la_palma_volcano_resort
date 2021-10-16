/*
cd /home/joan/projectes/OSM/la_palma/SQL
mysql -u alumne -pkeiL2lai la_palma -f < ./la_palma_v5_load.sql > ./control_errors.log 2>&1
cat control_errors.log
*/

# CREATE DATABASE la_palma CHARACTER SET utf8 COLLATE utf8_general_ci;
# GRANT ALL ON la_palma.* TO alumne@localhost;
# flush privileges
# use la_palma

# còpia:
# mysqldump -i --complete-insert -u root -p -r copia_la_palma_211012.sql la_palma

# l'objectiu és registrar els propietaris de les parcel·les, però també l'històric de les transaccions que hi ha. Les parcel·les es poden comprar i vendre, poden canviar de mans.
# una parcel·la només té un propietari, però en pot haver tingut molts (històric)
# existeix un propietari, l'admin, que és el propietari inicial i que s'ha apropiat de tot el territori (Ley del Oeste)

# PARCEL (id_parcel, code, lat, lon, base_price)
# OWNER (id_owner, name, surname, telephone, mail)
# TRANSACTION (id_transaction, id_parcel, id_owner, date_transaction, price)

DROP TABLE IF EXISTS TRANSACTION;
DROP TABLE IF EXISTS OWNER;
DROP TABLE IF EXISTS PARCEL;

# NOTA: no cal PARCEL.id_owner perquè el registre del propietari estarà a TRANSACTION (tot i que per comoditat podríem posar i actualitzar el camp id_owner)
# tampoc no cal PARCEL.has_owner doncs amb TRANSACTION ja tenim la informació de quins són els propietaris
CREATE TABLE PARCEL (
id_parcel smallint PRIMARY KEY,
code CHAR(3) NOT NULL UNIQUE,
lat DECIMAL(7,4) NOT NULL,
lon DECIMAL(7,4) NOT NULL,
base_price DECIMAL(7,2)
);

CREATE TABLE OWNER (
id_owner smallint PRIMARY KEY,
name VARCHAR(50) NOT NULL, 
surname VARCHAR(50) NOT NULL, 
telephone VARCHAR(25) NULL,
mail VARCHAR(50) NULL
);

CREATE TABLE TRANSACTION (
id_transaction smallint PRIMARY KEY,
id_parcel smallint,
id_owner smallint,
date_transaction datetime,
price DECIMAL(7,2),
FOREIGN KEY (id_parcel) REFERENCES PARCEL(id_parcel),
FOREIGN KEY (id_owner) REFERENCES OWNER(id_owner)
);

# Dades de prova
INSERT INTO PARCEL VALUES (1,'G-L', 28.6145, -17.9267, 30000.00);
INSERT INTO PARCEL VALUES (2,'G-M', 28.6145, -17.9262, 30000.00);
INSERT INTO PARCEL VALUES (3,'G-N', 28.6140, -17.9277, 30000.00);
INSERT INTO PARCEL VALUES (4,'G-O', 28.6140, -17.9272, 30000.00);
INSERT INTO PARCEL VALUES (5,'G-P', 28.6140, -17.9267, 30000.00);

INSERT INTO OWNER VALUES (1, '', 'admin', '636 51 77 85', 'joanqc@gmail.com');
INSERT INTO OWNER VALUES (2, 'Pere', 'Riudoms', '640 34 56 68', 'priudoms@gmail.com');
INSERT INTO OWNER VALUES (3, 'Maria', 'Bartolí', '600 32 43 54', 'mbartoli@gmail.com');

#incialment el propietari de totes les parcel·les és el id_owner=1 (admin)
INSERT INTO TRANSACTION VALUES (1,1,1,'2021-10-09 00:00:00', 30000.00);
INSERT INTO TRANSACTION VALUES (2,2,1,'2021-10-09 00:00:00', 30000.00);
INSERT INTO TRANSACTION VALUES (3,3,1,'2021-10-09 00:00:00', 30000.00);
INSERT INTO TRANSACTION VALUES (4,4,1,'2021-10-09 00:00:00', 30000.00);
INSERT INTO TRANSACTION VALUES (5,5,1,'2021-10-09 00:00:00', 30000.00);

# es fa una compra
INSERT INTO TRANSACTION VALUES (6,1,2,'2021-10-09 09:00:00', 31000.00);

# Totes les transaccions que hi ha hagut
SELECT id_transaction, date_transaction, P.id_parcel, code, price, name, surname FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner ORDER BY id_parcel;

# Totes les transaccions que hi ha hagut sobre la parcel·la F-N
SELECT id_transaction, date_transaction, P.id_parcel, code, price, name, surname FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE code='F-N';


# les últimes transaccions que s'han fet de cada parcel·la (servirà per saber quin és el propietari actual)
# per saber quin és el propietari actual, he de mirar el valor més alt de id_transaction, o bé el valor més alt de date_transaction 
select max(id_transaction), P.id_parcel, max(date_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel GROUP BY id_parcel ORDER BY P.id_parcel;

# les últimes transaccions que s'han fet de cada parcel·la (sense comptar la transacció inicial de quan es crea la parcel·la)(servirà per saber quin és el propietari actual)
select max(id_transaction), P.id_parcel, max(date_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel WHERE date_transaction > '2021-10-09 00:00:00' GROUP BY id_parcel ORDER BY P.id_parcel;

# parcel·les i propietari actual
SELECT P.id_parcel, id_transaction, code, name, surname FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel GROUP BY P.id_parcel) ORDER BY P.id_parcel;

# parcel·les i propietari actual (que no sigui el admin)
SELECT P.id_parcel, id_transaction, code, name, surname FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel WHERE O.id_owner!=1 GROUP BY P.id_parcel) ORDER BY P.id_parcel;

# parcel·les lliures (parcel·les que el propietari és el id_owner=1)
SELECT P.id_parcel, code FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel GROUP BY P.id_parcel) AND O.id_owner=1 ORDER BY P.id_parcel;

# NOTA: totes aquests consultes serien més fàcils si existís el camp PARCEL.id_owner, i cada cop que es fes una transacció, es fes un UPDATE de PARCEL.id_owner.

# netejar la bd:
DELETE FROM TRANSACTION;
DELETE FROM OWNER;
DELETE FROM PARCEL;
