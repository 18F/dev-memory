/*** README ***

PURPOSE: 
Google Apps script to find all files created in the past week in a Google Docs folder (and its subfolders), 
and list them at the top of a spreadsheet.

MAIN PROGRAM: 
MyFunction

HOW TO USE:
1. Set TOP_LEVEL_FOLDER_ID to your project folder's ID (found in the folder's URL)
2. Set SPREADSHEET_ID to the spreadsheet ID where you want to list the files (also found in the sheet's URL)
3. Set ACTIVE_SHEET_INDEX to the number of the exact sheet in your spreadsheet (remember indexing is 0-based)
4. Run the main program - MyFunction
5. Watch your data appear at the top of the spreadsheet!

To request GSA IT approval for your implementation of this script, 
prefix your Google Apps script title with `GSA_[your office code]_` and submit this form:
https://docs.google.com/forms/d/e/1FAIpQLSdOCtxCaSKJC87CedZW1FKGspMvnRzyOauMvKIOfrSV7PBdag/viewform

*************/

// Helper: Get all files in a single folder
function getFilesInFolder(folder, collection, dt) {
  files = folder.getFiles();
  while (files.hasNext()){
    file = files.next();
    if (file.getDateCreated() > dt) {
      collection.push([ file.getName(), file.getMimeType(), "add description", file.getOwner().getName(), file.getUrl() ])
      console.log("File Added: ", file.getName());
    }
  }
  return collection;
}
// Helper: get all subfolders, then get their files
function getSubFoldersRecursive(parent, collection, dt) {
  parent = parent.getId();
  var childFolder = DriveApp.getFolderById(parent).getFolders();
  var nextChild;
  
  while(childFolder.hasNext()) {
    nextChild = childFolder.next();
    console.log("Folder: ", nextChild.getName());
    collection = getFilesInFolder(nextChild, collection, dt);
    getSubFoldersRecursive(nextChild, collection, dt);
  }
  return collection;
}
// Main process
function myFunction() {
  // Set project constants here
  var TOP_LEVEL_FOLDER_ID = ''; // TODO: set your folder ID
  var SPREADSHEET_ID = ''; // TODO: set your spreadsheet ID
  var ACTIVE_SHEET_INDEX = 3; // TODO: set correct number here

  var projectFolder = DriveApp.getFolderById(TOP_LEVEL_FOLDER_ID);
  
  // Set date for 1 week ago
  var dt = new Date();
  dt.setDate(dt.getDate() - 7);

  // Collect new files by walking the folder tree
  var collection = getFilesInFolder(projectFolder, [], dt);
  collection = getSubFoldersRecursive(projectFolder, collection, dt);

  // Add new files to spreadsheet
  console.log("Adding files to sheet:")
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ss.setActiveSheet(ss.getSheets()[ACTIVE_SHEET_INDEX]); 
  for (let i = 0; i < collection.length; i++) {
    ss.insertRowBefore(2); // in between header row and first content row, using content row's formatting
    ss.getRange('A2:E2').setValues([ collection[i] ]); // NOTE: range should match length of inserted array
  }
}
