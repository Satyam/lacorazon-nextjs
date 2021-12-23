import sqlite3, { Database } from 'sqlite3';
import * as sqlite from 'sqlite';

const dbName = ':memory:';

const createVendedores = `
  DROP TABLE IF EXISTS "Vendedores";
  CREATE TABLE "Vendedores" (
    "id"	text NOT NULL UNIQUE,
    "nombre"	text NOT NULL,
    "email"	text,
    PRIMARY KEY("id")
  );
  DROP INDEX IF EXISTS "vendedorEmail";
  CREATE UNIQUE INDEX "vendedorEmail" ON "Vendedores" (
    "email"
  );
  DROP INDEX IF EXISTS "vendedorNombre";
  CREATE UNIQUE INDEX "vendedorNombre" ON "Vendedores" (
    "nombre"
  );
`;
const firstInsert =
  'INSERT INTO "Vendedores" VALUES ("idPepe","pepe","pepe@correo.com")';
const secondInsert =
  'INSERT INTO "Vendedores" VALUES ("idPepe1","pepe1","pepe1@correo.com")';
const dupNombre =
  'INSERT INTO "Vendedores" VALUES ("idPepe2","pepe","pepe1@correo.com")';
const dupEmail =
  'INSERT INTO "Vendedores" VALUES ("idPepe2","pepe2","pepe@correo.com")';
const countRecords = 'select count(*) as cant from Vendedores';

const rxUnique = /UNIQUE\s*constraint\s*failed:\s*([a-zA-Z]\w*)\.([a-zA-Z]\w*)/;

describe('with sqlite3', () => {
  let db: Database;

  beforeAll((done) => {
    db = new sqlite3.Database(dbName, function (err) {
      if (err !== null) done(err);
      sqlite3.verbose();
      db.exec(createVendedores, (err) => {
        if (err) done(err);
        else done();
      });
    });
  });
  afterAll(() => {
    db.close();
  });

  test('Insert one Vendedor', (done) => {
    db.run(firstInsert, function (err) {
      if (err) done(err);
      else {
        expect(this.lastID).toBeGreaterThan(0);
        expect(this.changes).toBe(1);
        done();
      }
    });
  });

  test('Insert second Vendedor', (done) => {
    db.run(secondInsert, function (err) {
      if (err) done(err);
      else {
        expect(this.lastID).toBeGreaterThan(0);
        expect(this.changes).toBe(1);
        done();
      }
    });
  });

  test('check there are two records', (done) => {
    db.get(countRecords, (err, row) => {
      if (err) done(err);
      expect(row.cant).toBe(2);
      done();
    });
  });

  test('Insert duplicate nombre', (done) => {
    db.run(dupNombre, (err) => {
      if (err) {
        const m = rxUnique.exec(err.toString());
        if (m === null) done('failed to match duplicate regexp:', err);
        else {
          expect(m[1]).toBe('Vendedores');
          expect(m[2]).toBe('nombre');
        }
        done();
      } else done('failed to catch duplicate');
    });
  });

  test('Insert duplicate email', (done) => {
    db.run(dupEmail, (err) => {
      if (err) {
        const m = rxUnique.exec(err.toString());
        if (m === null) done('failed to match duplicate regexp:', err);
        else {
          expect(m[1]).toBe('Vendedores');
          expect(m[2]).toBe('email');
        }
        done();
      } else done('failed to catch duplicate');
    });
  });

  test('check there are still only two records', (done) => {
    db.get(countRecords, (err, row) => {
      if (err) done(err);
      expect(row.cant).toBe(2);
      done();
    });
  });
});

describe('with sqlite', () => {
  let db: sqlite.Database;

  beforeAll(async () => {
    db = await sqlite.open({
      filename: ':memory:',
      driver: sqlite3.Database,
    });
    db.exec(createVendedores);
  });
  afterAll(() => db.close());

  test('Insert one record', () =>
    db.run(firstInsert).then((result) => {
      expect(result.lastID).toBe(1);
      expect(result.changes).toBe(1);
    }));

  test('Insert second record', () =>
    db.run(secondInsert).then((result) => {
      expect(result.lastID).toBe(2);
      expect(result.changes).toBe(1);
    }));

  test('Count Records', () =>
    db.get<{ cant: number }>(countRecords).then((result) => {
      expect(result?.cant).toBe(2);
    }));

  test('Duplicate nombre', () =>
    db
      .run(dupNombre)
      .then(() => Promise.reject('should not have succeeded'))
      .catch((err) => {
        const m = rxUnique.exec(err.toString());
        if (m === null)
          return Promise.reject(`failed to match duplicate regexp: ${err}`);
        expect(m[1]).toBe('Vendedores');
        expect(m[2]).toBe('nombre');
      }));

  test('Duplicate email', () =>
    db
      .run(dupEmail)
      .then(() => Promise.reject('should not have succeeded'))
      .catch((err) => {
        const m = rxUnique.exec(err.toString());
        if (m === null)
          return Promise.reject(`failed to match duplicate regexp: ${err}`);
        expect(m[1]).toBe('Vendedores');
        expect(m[2]).toBe('email');
      }));

  test('Check there are still only two records', () =>
    db.get<{ cant: number }>(countRecords).then((result) => {
      expect(result?.cant).toBe(2);
    }));
});
