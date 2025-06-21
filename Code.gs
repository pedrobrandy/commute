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

// Nuevo do post
function doPost(e) {
  try {
    const action = e.parameter.action;
    if (!action) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'El parámetro action es requerido'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'login') {
      return ContentService.createTextOutput(JSON.stringify(login(e)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'register') {
      return ContentService.createTextOutput(JSON.stringify(register(e.parameter)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveReservation') {
      return ContentService.createTextOutput(JSON.stringify(saveReservation(e.parameter)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'getUserByEmail') {
      return ContentService.createTextOutput(JSON.stringify(getUserByEmail(e.parameter)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'updateLast') {
      return ContentService.createTextOutput(JSON.stringify(updateLast(e.parameter)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'googleLogin') {
      return ContentService.createTextOutput(JSON.stringify(googleLogin(e.parameter)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'updateUserPhone') {
      return ContentService.createTextOutput(JSON.stringify(updateUserPhone(e.parameter)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Google Apps Script is working!',
        timestamp: new Date().toISOString(),
        actions: ['login', 'register', 'saveReservation', 'getUserByEmail', 'updateLast', 'googleLogin', 'updateUserPhone']
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'actualizar_estado') {
      const id = e.parameter.id;
      const status = e.parameter.status;

      if (!id || !status) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'ID y estado son requeridos'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(RESERVATIONS_SHEET);
      const data = sheet.getDataRange().getValues();

      for (let i = 1; i < data.length; i++) {
        if (data[i][0].toString() === id.toString()) {
          sheet.getRange(i + 1, 3).setValue(status); // Columna 3 es "status"
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: 'Your reservation was changed successfully'
          }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'ID no encontrado'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Acción no reconocida'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error interno: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
//Prueba
function doGet(e) {
  let response;
  try {
    if (!e || !e.parameter) throw new Error("Parámetros inválidos");

    const action = (e.parameter.action || "").trim();
    const route = (e.parameter.route || "").trim();

    if (route === "registro" && action === "ver_todos") {
      response = obtenerRegistrosSinFiltro();
    } else {
      response = { success: false, message: 'Acción inválida' };
    }
  } catch (error) {
    response = { success: false, message: error.message };
  }

  const callback = e.parameter.callback;
  const json = JSON.stringify(response);
  let output;

  if (callback) {
    output = ContentService.createTextOutput(`${callback}(${json});`);
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    output = ContentService.createTextOutput(json);
    output.setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}

// Handle GET requests



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
    const phoneIndex = headers.indexOf('phone');
    
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
          isActive: isActiveIndex !== -1 ? row[isActiveIndex] : true,
          phone: phoneIndex !== -1 ? row[phoneIndex] : ''
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
      email: user.email,
      phone: user.phone
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

    // Ensure phone number is available
    let phoneNumber = data.phone;
    if (!phoneNumber || phoneNumber === "-" || phoneNumber === "") {
      // Try to get phone from user database
      const usersSheet = ss.getSheetByName("Users");
      if (usersSheet && data.email) {
        const userRows = usersSheet.getDataRange().getValues();
        for (let i = 1; i < userRows.length; i++) {
          if (userRows[i][1] === data.email) { // email is column 1
            phoneNumber = userRows[i][2]; // phone is column 2
            console.log('Found phone number from user database:', phoneNumber);
            break;
          }
        }
      }
    }

    // If still no phone, use a placeholder
    if (!phoneNumber || phoneNumber === "-" || phoneNumber === "") {
      phoneNumber = "No proporcionado";
      console.log('No phone number found, using placeholder');
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
      phoneNumber,                  // phone (ensured to have value)
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

function register(params) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(USERS_SHEET);
  
  const { fullName, email, phone, password } = params;

  if (!email || !password) {
    return {
      success: false,
      message: 'Missing email or password'
    };
  }

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) {
      return {
        success: false,
        message: 'Email already exists'
      };
    }
  }

  sheet.appendRow([
    fullName,
    email,
    phone,
    password,
    true,
    new Date().toISOString(),
    new Date().toISOString()
  ]);

  return {
    success: true,
    message: 'User registered successfully'
  };
}
//prueba
function obtenerRegistrosSinFiltro() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("reservations");
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  const results = data.map(row => ({
    id: row[0],
    type: row[1],
    status: row[2],
    name: row[3],
    phone: row[4],
    email: row[5],
    origin: row[6],
    destination: row[7],
    directionText: row[8],
    timeText: row[9],
    timeValue: row[10],
    startDate: row[11],
    endDate: row[12],
    distanceText: row[13],
    ETAY: row[14],
    price: row[15],
    adjustedDrivingMinutes: row[16],
    adjustedDriving: row[17],
    Duration: row[18],
    transitDurationText: row[19],
    estimatedArrivalTime: row[20],
    createdAt: row[21]
  }));

  return { success: true, results };
}
//lo deje pa ve

// Google Sign-In user registration
function googleLogin(params) {
  try {
    console.log('=== GOOGLE LOGIN DEBUG START ===');
    console.log('Google login function called');
    console.log('Received parameters:', params);
    console.log('Parameter keys:', Object.keys(params));
    
    const { fullName, email, googleId, picture, phone } = params;
    
    console.log('Extracted values:');
    console.log('- fullName:', fullName);
    console.log('- email:', email);
    console.log('- googleId:', googleId);
    console.log('- picture:', picture);
    console.log('- phone:', phone);
    
    if (!email || !fullName) {
      console.log('❌ Missing email or fullName');
      console.log('- email present:', !!email);
      console.log('- fullName present:', !!fullName);
      return {
        success: false,
        message: 'Email y nombre son requeridos'
      };
    }
    
    console.log('✅ Email and fullName validation passed');
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('📊 Spreadsheet opened, ID:', SPREADSHEET_ID);
    
    const sheet = ss.getSheetByName(USERS_SHEET);
    console.log('📋 Users sheet found:', !!sheet);
    
    if (!sheet) {
      console.log('❌ Users sheet not found');
      return {
        success: false,
        message: 'Hoja de usuarios no encontrada'
      };
    }
    
    // Check if user already exists
    const rows = sheet.getDataRange().getValues();
    console.log('📊 Total rows in users sheet:', rows.length);
    console.log('📊 Headers:', rows[0]);
    
    let userExists = false;
    let existingUserRow = -1;
    
    for (let i = 1; i < rows.length; i++) {
      const rowEmail = rows[i][1]; // email is in column 1
      console.log(`Checking row ${i}: ${rowEmail} vs ${email}`);
      if (rowEmail === email) {
        userExists = true;
        existingUserRow = i + 1; // +1 because sheet rows are 1-indexed
        console.log('✅ User found at row:', existingUserRow);
        break;
      }
    }
    
    if (userExists) {
      // Update last login for existing user
      console.log('🔄 User exists, updating last login');
      sheet.getRange(existingUserRow, 6).setValue(new Date().toISOString()); // lastLogin is column 6
      
      // Update phone number if provided and user doesn't have one
      const existingPhone = sheet.getRange(existingUserRow, 3).getValue(); // phone is column 3
      console.log('📱 Existing phone:', existingPhone);
      
      if ((!existingPhone || existingPhone === '') && phone) {
        sheet.getRange(existingUserRow, 3).setValue(phone);
        console.log('📱 Updated phone number for existing user:', phone);
      }
      
      const result = {
        success: true,
        message: 'Login exitoso',
        fullName: fullName,
        email: email,
        phone: phone || existingPhone || '',
        isNewUser: false,
        needsPhone: !existingPhone && !phone
      };
      
      console.log('✅ Returning result for existing user:', result);
      console.log('=== GOOGLE LOGIN DEBUG END ===');
      return result;
      
    } else {
      // Create new user
      console.log('🆕 Creating new user');
      const userPhone = phone || '';
      
      const newUserData = [
        fullName,           // fullName
        email,              // email
        userPhone,          // phone
        '',                 // password (empty for Google users)
        true,               // isActive
        new Date().toISOString(), // lastLogin
        new Date().toISOString()  // createdAt
      ];
      
      console.log('📝 New user data to append:', newUserData);
      sheet.appendRow(newUserData);
      console.log('✅ New user row appended successfully');
      
      const result = {
        success: true,
        message: 'Usuario registrado exitosamente',
        fullName: fullName,
        email: email,
        phone: userPhone,
        isNewUser: true,
        needsPhone: !userPhone
      };
      
      console.log('✅ Returning result for new user:', result);
      console.log('=== GOOGLE LOGIN DEBUG END ===');
      return result;
    }
    
  } catch (error) {
    console.error('❌ Error in googleLogin:', error);
    console.error('Error stack:', error.stack);
    console.log('=== GOOGLE LOGIN DEBUG END WITH ERROR ===');
    return {
      success: false,
      message: 'Error en el login de Google: ' + error.message
    };
  }
}

// Update user phone number
function updateUserPhone(params) {
  try {
    console.log('Update user phone function called');
    console.log('Received parameters:', params);
    
    const { email, phone } = params;
    
    if (!email || !phone) {
      console.log('Missing email or phone');
      return {
        success: false,
        message: 'Email y teléfono son requeridos'
      };
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(USERS_SHEET);
    
    // Find user by email
    const rows = sheet.getDataRange().getValues();
    let userRow = -1;
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] === email) { // email is in column 1
        userRow = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (userRow === -1) {
      return {
        success: false,
        message: 'Usuario no encontrado'
      };
    }
    
    // Update phone number
    sheet.getRange(userRow, 3).setValue(phone); // phone is column 3
    console.log('Phone number updated successfully');
    
    return {
      success: true,
      message: 'Número de teléfono actualizado exitosamente',
      phone: phone
    };
    
  } catch (error) {
    console.error('Error in updateUserPhone:', error);
    return {
      success: false,
      message: 'Error al actualizar el número de teléfono: ' + error.message
    };
  }
}

