import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('census');

export interface Location {
    id: number;
    enumeration_area: string;
    province: string;
    district: string;
    llg: string;
    ward: string;
    census_unit: string;
}

export interface HomeAddress {
    id: number;
    locality: string;
    section: string;
    lot: string;
    structure_record_no: string;
    pd_no: string;
    house_no: string;
}

export interface Registry {
    id: number;
    occupants: string;
    firstName: string;
    lastName: string;
    relationship: string;
    sex: string;
    dob: string; 
    maritalStatus: string;
    citizenship: string;
    country: string;
}

export interface Comments {
    id: number;
    comments: string;
}

export const initializeDB = async () => {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;

    
        CREATE TABLE IF NOT EXISTS location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        enumeration_area TEXT NOT NULL,
        province TEXT NOT NULL,
        district TEXT NOT NULL,
        llg TEXT NOT NULL,
        ward TEXT NOT NULL,
        census_unit TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS home_address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locality TEXT NOT NULL,
        section TEXT NOT NULL,
        lot TEXT NOT NULL,
        structure_record_no TEXT NOT NULL,
        pd_no TEXT NOT NULL,
        house_no TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS registry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        occupants TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        relationship TEXT NOT NULL,
        sex TEXT NOT NULL,
        dob TEXT NOT NULL,
        maritalStatus TEXT NOT NULL,
        citizenship TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comments TEXT NOT NULL
        );
    `);
};

// Indicative information 
export const addLocation = async (enumeration_area: string, province: string, district: string, llg: string, ward: string, census_unit: string) => {
    try {
        const result = await db.runAsync('INSERT INTO location (enumeration_area, province, district, llg, ward, census_unit) VALUES (?, ?, ?, ?, ?, ?)', enumeration_area, province, district, llg, ward, census_unit);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding location:", error);
    }
};

export const updateLocations = async (id: number, enumeration_area: string, province: string, district: string, llg: string, ward: string, census_unit: string) => {
    try {
      await db.runAsync('UPDATE location SET enumeration_area = ?, province = ?, district = ?, llg = ?, ward = ?, census_unit = ? WHERE id = ?', enumeration_area, province, district, llg, ward, census_unit, id);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };
export const deleteLocations = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM location WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting location:", error);
    }
};

export const getLocations = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM location') as Location[];
        return allRows;
    } catch (error) {
        console.error("Error getting locations:", error);
        return [];
    }
};


// Home Address Information
export const addHomeAddress = async (locality: string, section: string, lot: string, structureRecordNo: string, pdNo: string, houseNo: string) => {
    try {
        const result = await db.runAsync('INSERT INTO home_address (locality, section, lot, structure_record_no, pd_no, house_no) VALUES (?, ?, ?, ?, ?, ?)', locality, section, lot, structureRecordNo, pdNo, houseNo);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding home address:", error);
    }
};

export const updateHomeAddress = async (id: number, locality: string, section: string, lot: string, structureRecordNo: string, pdNo: string, houseNo: string) => {
    try {
        await db.runAsync('UPDATE home_address SET locality = ?, section = ?, lot = ?, structure_record_no = ?, pd_no = ?, house_no = ? WHERE id = ?', locality, section, lot, structureRecordNo, pdNo, houseNo, id);
    } catch (error) {
        console.error("Error updating home address:", error);
    }
};

export const deleteHomeAddress = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM home_address WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting home address:", error);
    }
};

export const getHomeAddress = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM home_address') as HomeAddress[];
        return allRows;
    } catch (error) {
        console.error("Error getting home address:", error);
        return [];
    }
}

// Registry Information
export const addRegistry = async (occupants: string, firstName: string, lastName: string, relationship: string, sex: string, dob: string, maritalStatus: string, citizenship: string) => {
    try {
        const result = await db.runAsync('INSERT INTO registry (occupants, firstName, lastName, relationship, sex, dob, maritalStatus, citizenship) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', occupants, firstName, lastName, relationship, sex, dob, maritalStatus, citizenship);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding registry:", error);
    }
};

export const updateRegistry = async (id: number, occupants: string, firstName: string, lastName: string, relationship: string, sex: string, dob: string, maritalStatus: string, citizenship: string) => {
    try {
        await db.runAsync('UPDATE registry SET occupants = ?, firstName = ?, lastName = ?, relationship = ?, sex = ?, dob = ?, maritalStatus = ?, citizenship = ? WHERE id = ?', occupants, firstName, lastName, relationship, sex, dob, maritalStatus, citizenship, id);
    } catch (error) {
        console.error("Error updating registry:", error);
    }
};

export const deleteRegistry = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM registry WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting registry:", error);
    }
};

export const getRegistry = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM registry') as Registry[];
        return allRows;
    } catch (error) {
        console.error("Error getting registry:", error);
        return [];
    }
}

// Comments Information
export const addComments = async (comments: string) => {
    try {
        const result = await db.runAsync('INSERT INTO comments (comments) VALUES (?)', comments);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding comments:", error);
    }
};

export const updateComments = async (id: number, comments: string) => {
    try {
        await db.runAsync('UPDATE comments SET comments = ? WHERE id = ?', comments, id);
    } catch (error) {
        console.error("Error updating comments:", error);
    }
};

export const deleteComments = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM comments WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting comments:", error);
    }
};

export const getComments = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM comments') as Comments[];
        return allRows;
    } catch (error) {
        console.error("Error getting comments:", error);
        return [];
    }
}