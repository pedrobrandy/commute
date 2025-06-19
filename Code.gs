// Constants
const SPREADSHEET_ID = '1KMWf6u5zZxThVMzmNtcKWyjXtNne4UqfViiy3dDMj5I';
const USERS_SHEET = 'Users';
const RESERVATIONS_SHEET = 'Reservations';

function normalizeTime(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.toString().split(":");
  if (parts.length < 2) return timeStr;
  const hh = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  return `${hh}:${mm}`;
}

// Initialize sheets
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let usersSheet = ss.getSheetByName(USERS_SHEET);
  let reservationsSheet = ss.getSheetByName(RESERVATIONS_SHEET);
  
  // Create Users sheet if it doesn't exist
  if (!usersSheet) {
    usersSheet = ss.insertSheet(USERS_SHEET);
    usersSheet.appendRow(['fullName', 'email', 'phone', 'password', 'isActive', 'lastLogin', 'createdAt']);
    
    // Add a test account
    usersSheet.appendRow([
      'Test User',
      'test@example.com',
      '+1234567890',
      'test123',
      true,
      new Date().toISOString(),
      new Date().toISOString()
    ]);
  }

  // Create Reservations sheet if it doesn't exist
  if (!reservationsSheet) {
    reservationsSheet = ss.insertSheet(RESERVATIONS_SHEET);
    reservationsSheet.appendRow([
      'id',
      'type',
      'status',
      'name',
      'phone',
      'email',
      'origin',
      'destination',
      'directionText',
      'timeText',
      'timeValue',
      'startDate',
      'endDate',
      'distanceText',
      'ETAY',
      'price',
      'adjustedDrivingMinutes',
      'adjustedDrivingDuration',
      'transitDurationText',
      'estimatedArrivalTime',
      'createdAt'
    ]);
  }
}

// Handle POST requests
function doPost(e) {
  console.log('Received POST request');
  console.log('Parameters:', e.parameter);
  
  if (!e.parameter.action) {
    console.log('No action specified');
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'No action specified'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  let response;
  switch(e.parameter.action) {
    case 'login':
      console.log('Processing login request');
      response = login(e);
      break;
    case 'register':
      console.log('Processing register request');
      response = register(e.parameter);
      break;
    case 'getUserByEmail':
      console.log('Processing getUserByEmail request');
      response = getUserByEmail(e.parameter);
      break;
    case 'saveReservation':
      console.log('Processing saveReservation request');
      response = saveReservation(e.parameter);
      break;
    case 'updateLast':
      console.log('Processing updateLast request');
      response = updateLast(e.parameter);
      break;
    default:
      console.log('Unknown action:', e.parameter.action);
      response = {
        success: false,
        message: 'Unknown action'
      };
  }

  console.log('Sending response:', response);
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Handle GET requests
function doGet(e) {
  try {
    console.log('Received GET request:', e);
    console.log('Parameters:', e.parameter);
    
    if (!e || !e.parameter) {
      throw new Error("Parámetros de solicitud inválidos");
    }

    const action = e.parameter.action;
    console.log('Action:', action);
    
    if (!action) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "No action specified"
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    let response;
    switch (action) {
      case 'getReservations':
        response = getReservations(e);
        break;
      case 'getAvailableDates':
        response = getAvailableDates();
        break;
      case 'getUsers':
        response = getUsers();
        break;
      default:
        response = { success: false, message: 'Acción inválida: ' + action };
    }

    console.log('Response:', response);
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// User login
function login(e) {
  console.log('Login function called');
  console.log('Received parameters:', e.parameter);
  
  const email = e.parameter.email;
  const password = e.parameter.password;
  
  if (!email || !password) {
    console.log('Missing email or password');
    return {
      success: false,
      message: 'Email y contraseña son requeridos'
    };
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
    if (!sheet) {
      console.log('Users sheet not found');
      return {
        success: false,
        message: 'Error: Hoja de usuarios no encontrada'
      };
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Encontrar índices de columnas
    const emailIndex = headers.indexOf('email');
    const passwordIndex = headers.indexOf('password');
    const fullNameIndex = headers.indexOf('fullName');
    const isActiveIndex = headers.indexOf('isActive');
    
    if (emailIndex === -1 || passwordIndex === -1) {
      console.log('Required columns not found');
      return {
        success: false,
        message: 'Error: Columnas requeridas no encontradas'
      };
    }

    // Buscar usuario
    let user = null;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[emailIndex].toString().toLowerCase() === email.toLowerCase()) {
        user = {
          email: row[emailIndex],
          password: row[passwordIndex],
          fullName: fullNameIndex !== -1 ? row[fullNameIndex] : '',
          isActive: isActiveIndex !== -1 ? row[isActiveIndex] : true
        };
        break;
      }
    }

    if (!user) {
      console.log('User not found:', email);
      return {
        success: false,
        message: 'Email o contraseña incorrectos'
      };
    }

    // Verificar si la cuenta está activa
    if (user.isActive === false) {
      console.log('User account is inactive:', email);
      return {
        success: false,
        message: 'Cuenta desactivada'
      };
    }

    // Verificar contraseña
    const storedPassword = user.password.toString().trim();
    const providedPassword = password.toString().trim();
    
    console.log('Password verification:');
    console.log('Stored password length:', storedPassword.length);
    console.log('Provided password length:', providedPassword.length);
    
    if (storedPassword !== providedPassword) {
      console.log('Password mismatch for user:', email);
      return {
        success: false,
        message: 'Email o contraseña incorrectos'
      };
    }

    // Actualizar último login
    const lastLoginIndex = headers.indexOf('lastLogin');
    if (lastLoginIndex !== -1) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][emailIndex].toString().toLowerCase() === email.toLowerCase()) {
          sheet.getRange(i + 1, lastLoginIndex + 1).setValue(new Date());
          break;
        }
      }
    }

    console.log('Login successful for user:', email);
    return {
      success: true,
      message: 'Login exitoso',
      fullName: user.fullName,
      email: user.email
    };

  } catch (error) {
    console.error('Error in login:', error);
    return {
      success: false,
      message: 'Error al procesar el login'
    };
  }
}

// Register new user
function registrarUsuario(data) {
  try {
    console.log('Registering user with data:', data);
    
    // Obtener la hoja de usuarios
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let usersSheet = ss.getSheetByName("Users");
    
    // Si la hoja no existe, crearla
    if (!usersSheet) {
      console.log('Users sheet not found, creating it...');
      usersSheet = ss.insertSheet("Users");
      const headers = ["fullName", "email", "phone", "password", "isActive", "lastLogin", "createdAt"];
      usersSheet.appendRow(headers);
      usersSheet.setFrozenRows(1);
    }

    // Verificar campos requeridos
    if (!data.fullName || !data.email || !data.phone || !data.password) {
      console.log('Missing required fields:', data);
      return { success: false, message: "All fields are required" };
    }

    // Verificar si el email ya existe
    const sheetData = usersSheet.getDataRange().getValues();
    const headers = sheetData[0];
    const emailCol = headers.indexOf("email");
    
    if (emailCol === -1) {
      console.log('Invalid sheet structure:', headers);
      return { success: false, message: "Invalid sheet structure" };
    }

    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][emailCol] === data.email) {
        console.log('Email already exists:', data.email);
        return { success: false, message: "Email already registered" };
      }
    }

    // Crear nuevo usuario
    const now = new Date().toISOString();
    const newUser = [
      data.fullName,
      data.email,
      data.phone,
      data.password,
      true, // isActive
      now,  // lastLogin
      now   // createdAt
    ];

    console.log('Adding new user:', newUser);
    usersSheet.appendRow(newUser);
    
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Error in registrarUsuario:", error);
    return { success: false, message: "Error registering user: " + error.toString() };
  }
}

// Get user by email
function getUserByEmail(data) {
  try {
    console.log('Getting user by email:', data.email);
    
    if (!data.email) {
      return {
        success: false,
        message: "Email is required"
      };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName("Users");
    
    if (!usersSheet) {
      return {
        success: false,
        message: "Users sheet not found"
      };
    }

    const sheetData = usersSheet.getDataRange().getValues();
    const headers = sheetData[0];
    const emailCol = headers.indexOf("email");
    const nameCol = headers.indexOf("fullName");
    const phoneCol = headers.indexOf("phone");
    const isActiveCol = headers.indexOf("isActive");

    if (emailCol === -1) {
      return {
        success: false,
        message: "Invalid sheet structure"
      };
    }

    // Buscar el usuario por email
    const userRow = sheetData.findIndex((row, index) => 
      index > 0 && row[emailCol].toString().toLowerCase() === data.email.toLowerCase()
    );

    if (userRow === -1) {
      return {
        success: false,
        message: "User not found"
      };
    }

    const user = sheetData[userRow];
    
    // Retornar datos del usuario (sin la contraseña)
    const userData = {
      fullName: user[nameCol] || "",
      email: user[emailCol],
      phone: user[phoneCol] || "",
      isActive: user[isActiveCol] !== false
    };

    return {
      success: true,
      user: userData
    };

  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return {
      success: false,
      message: "Error getting user: " + error.toString()
    };
  }
}

// Save new reservation
function saveReservation(data) {
  try {
    console.log('Saving reservation with data:', data);
    
    // Obtener la hoja de reservaciones
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let reservationsSheet = ss.getSheetByName("Reservations");
    
    // Si la hoja no existe, crearla
    if (!reservationsSheet) {
      console.log('Reservations sheet not found, creating it...');
      reservationsSheet = ss.insertSheet("Reservations");
      const headers = [
        "id", "type", "status", "name", "phone", "email", 
        "origin", "destination", "directionText", "timeText", 
        "timeValue", "startDate", "endDate", "distanceText", 
        "ETAY", "price", "adjustedDrivingMinutes", 
        "adjustedDrivingDuration", "transitDurationText", 
        "estimatedArrivalTime", "createdAt"
      ];
      reservationsSheet.appendRow(headers);
      reservationsSheet.setFrozenRows(1);
    }

    // Generar ID único
    const id = Utilities.getUuid();
    const now = new Date().toISOString();

    // Crear nueva reservación
    const newReservation = [
      id,                           // id
      data.type || "-",            // type
      data.status || "Negociación", // status
      data.name || "-",            // name
      data.phone || "-",           // phone
      data.email || "-",           // email
      data.origin || "-",          // origin
      data.destination || "-",     // destination
      data.directionText || "-",   // directionText
      data.timeText || "-",        // timeText
      data.timeValue || "-",       // timeValue
      data.startDate || "-",       // startDate
      data.endDate || "-",         // endDate
      data.distanceText || "-",    // distanceText
      data.ETAY || "-",           // ETAY
      data.price || "0",          // price
      data.adjustedDrivingMinutes || "-", // adjustedDrivingMinutes
      data.adjustedDrivingDuration || "-", // adjustedDrivingDuration
      data.transitDurationText || "-",    // transitDurationText
      data.estimatedArrivalTime || "-",   // estimatedArrivalTime
      now                          // createdAt
    ];

    console.log('Adding new reservation:', newReservation);
    reservationsSheet.appendRow(newReservation);
    
    return { 
      success: true, 
      message: "Reservation saved successfully",
      id: id
    };
  } catch (error) {
    console.error("Error in saveReservation:", error);
    return { 
      success: false, 
      message: "Error saving reservation: " + error.toString() 
    };
  }
}

// Update reservation status
function updateStatus(e) {
  try {
    if (!e.parameter.id || !e.parameter.status) {
      return {
        success: false,
        message: 'ID y estado son requeridos'
      };
    }

    const id = parseInt(e.parameter.id, 10);
    const newStatus = e.parameter.status;

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(RESERVATIONS_SHEET);
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

    for (let i = 0; i < data.length; i++) {
      if (parseInt(data[i][0], 10) === id) {
        sheet.getRange(i + 2, 3).setValue(newStatus);
        return {
          success: true
        };
      }
    }

    return {
      success: false,
      message: 'ID no encontrado'
    };
  } catch (error) {
    console.error('Error updating status:', error);
    return {
      success: false,
      message: 'Error al actualizar el estado: ' + error.message
    };
  }
}

// Get all reservations
function getReservations(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(RESERVATIONS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const reservations = data.slice(1).map(row => {
      const reservation = {};
      headers.forEach((header, index) => {
        reservation[header] = row[index];
      });
      return reservation;
    });

    return {
      success: true,
      reservations: reservations
    };
  } catch (error) {
    console.error('Error getting reservations:', error);
    return {
      success: false,
      message: 'Error al obtener las reservaciones: ' + error.message
    };
  }
}

// Get available dates
function getAvailableDates() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(RESERVATIONS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const reservations = data.slice(1);

    const availableDates = new Set();
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    while (today <= nextMonth) {
      availableDates.add(today.toISOString().split('T')[0]);
      today.setDate(today.getDate() + 1);
    }

    return {
      success: true,
      dates: Array.from(availableDates)
    };
  } catch (error) {
    console.error('Error getting available dates:', error);
    return {
      success: false,
      message: 'Error al obtener las fechas disponibles: ' + error.message
    };
  }
}

// Get all users
function getUsers() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const users = data.slice(1).map(row => {
      const user = {};
      headers.forEach((header, index) => {
        user[header] = row[index];
      });
      return user;
    });

    return {
      success: true,
      users: users
    };
  } catch (error) {
    console.error('Error getting users:', error);
    return {
      success: false,
      message: 'Error al obtener los usuarios: ' + error.message
    };
  }
}

// Update last reservation status
function updateLast(data) {
  try {
    console.log('Updating last reservation status:', data);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reservationsSheet = ss.getSheetByName("Reservations");
    
    if (!reservationsSheet) {
      return { success: false, message: "Reservations sheet not found" };
    }

    const sheetData = reservationsSheet.getDataRange().getValues();
    const headers = sheetData[0];
    const statusCol = headers.indexOf("status");
    
    if (statusCol === -1) {
      return { success: false, message: "Invalid sheet structure" };
    }

    // Actualizar la última reservación
    const lastRow = reservationsSheet.getLastRow();
    if (lastRow > 1) {
      reservationsSheet.getRange(lastRow, statusCol + 1).setValue(data.status);
      return { success: true, message: "Status updated successfully" };
    }

    return { success: false, message: "No reservations found" };
  } catch (error) {
    console.error("Error in updateLast:", error);
    return { success: false, message: "Error updating status: " + error.toString() };
  }
} 