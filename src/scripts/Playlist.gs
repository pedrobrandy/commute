function doGet(e) {
  try {
    const action = e.parameter.action || 'test';

    switch (action) {
      case 'getPlaylist':
        return getPlaylistVideos(e.parameter);
      case 'searchVideos':
        return searchVideos(e.parameter);
      case 'addToPlaylist':
        return addToPlaylist(e.parameter);
      case 'removeFromPlaylist':
        return removeFromPlaylist(e.parameter);
      case 'test':
      default:
        return testConnection();
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  switch (action) {
    case 'submit_song':
      return submitSong(data);
    case 'approve_song':
      return approveSong(data);
    default:
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid action'
      })).setMimeType(ContentService.MimeType.JSON);
  }
}

function submitSong(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Playlist");
    if (!sheet) {
      // Create sheet if it doesn't exist
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Playlist");
      newSheet.getRange(1, 1, 1, 5).setValues([['timestamp', 'name', 'routeid', 'videoId', 'youtubeURL']]);
    }

    const timestamp = new Date().toISOString();
    const routeId = 'Playlist_' + new Date().getTime(); // Generate a unique routeId

    sheet.appendRow([
      timestamp,
      data.user,
      routeId,
      data.videoId,
      `https://www.youtube.com/watch?v=${data.videoId}`
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Song submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error submitting song: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSubmissions(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Playlist");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        results: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const submissions = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      results: submissions
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error getting submissions: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function approveSong(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Playlist");
    const videoId = data.videoId;

    // Find the row with this videoId
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    for (let i = 1; i < values.length; i++) {
      if (values[i][3] === videoId) { // videoId is in column 4 (index 3)
        // Add to YouTube playlist
        const success = addToYouTubePlaylist(videoId);

        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: success ? 'Song approved and added to playlist' : 'Song approved but failed to add to YouTube playlist. Check API key and permissions.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Song not found'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error approving song: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getDailyPlaylist(e) {
  try {
    const date = e.parameter.date || new Date().toISOString().split('T')[0];
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Playlist");

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        results: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const submissions = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // Filter by date (today's submissions)
    const today = new Date().toISOString().split('T')[0];
    const dailySongs = submissions.filter(submission => {
      const submissionDate = new Date(submission.timestamp).toISOString().split('T')[0];
      return submissionDate === today;
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      results: dailySongs
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error getting daily playlist: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function authorizeYouTube() {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'YouTube authorization not required for API key method'
  })).setMimeType(ContentService.MimeType.JSON);
}

function testAuth() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'API key authentication is active'
  })).setMimeType(ContentService.MimeType.JSON);
}

function addToYouTubePlaylist(videoId) {
  try {
    // Use API key method instead of OAuth2
    const apiKey = 'YOUR_GOOGLE_API_KEY_HERE';
    const playlistId = 'PLdGwROaOdT_TtRuGfBKJbM9EL2EFdg_6c';

    // First, get the video details to ensure it exists
    const videoResponse = UrlFetchApp.fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    const videoData = JSON.parse(videoResponse.getContentText());

    if (!videoData.items || videoData.items.length === 0) {
      Logger.log("Video not found: " + videoId);
      return false;
    }

    // Add to playlist using API key
    const payload = {
      snippet: {
        playlistId: playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId: videoId
        }
      }
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };

    // Note: This will only work if the playlist is public or the API key has proper permissions
    const response = UrlFetchApp.fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${apiKey}`,
      options
    );

    const result = JSON.parse(response.getContentText());

    if (result.error) {
      Logger.log("YouTube API Error: " + JSON.stringify(result.error));
      return false;
    }

    Logger.log("Successfully added to YouTube playlist: " + videoId);
    return true;

  } catch (error) {
    Logger.log("Error adding to YouTube playlist: " + error.toString());
    return false;
  }
}

// Function to generate daily playlist URL
function generateDailyPlaylistUrl(date) {
  return `https://www.youtube.com/embed/videoseries?list=PLdGwROaOdT_TtRuGfBKJbM9EL2EFdg_6c`;
}

function testConnection() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'YouTube Playlist API is working',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function getPlaylistVideos(params) {
  const playlistId = params.playlistId || 'PLdGwROaOdT_TtRuGfBKJbM9EL2EFdg_6c';
  const maxResults = params.maxResults || 10;

  // IMPORTANT: Replace with your actual API key
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE';

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;

  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function searchVideos(params) {
  const query = params.query || 'commute music';
  const maxResults = params.maxResults || 5;

  // IMPORTANT: Replace with your actual API key
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE';

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;

  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addToPlaylist(params) {
  const playlistId = params.playlistId || 'PLdGwROaOdT_TtRuGfBKJbM9EL2EFdg_6c';
  const videoId = params.videoId;

  if (!videoId) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Video ID is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // IMPORTANT: Replace with your actual API key
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE';

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${apiKey}`;

  const payload = {
    snippet: {
      playlistId: playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId: videoId
      }
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });

    const data = JSON.parse(response.getContentText());

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function removeFromPlaylist(params) {
  const playlistItemId = params.playlistItemId;

  if (!playlistItemId) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Playlist Item ID is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // IMPORTANT: Replace with your actual API key
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE';

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?id=${playlistItemId}&key=${apiKey}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'DELETE'
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Video removed from playlist'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
