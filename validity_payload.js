const fs = require('fs');
const path = require('path');

const downloadDirectory = path.join(__dirname, 'Group A', 'Flow 2');
const payload = {
    "search_full_catalog_refresh": {},
    "on_search_full_catalog_refresh": {},
    "search_inc_refresh": {},
    "on_search_inc_refresh": {},
    "select": {},
    "on_select": {},
    "init": {},
    "on_init": {},
    "confirm": {},
    "on_confirm": {},
    "on_status_pending": {},
    "on_status_picked": {},
    "on_status_delivered": {},
    "ret_issue": {},
    "ret_issue_close": {},
    "ret_on_issue": {},
    "ret_issue_status": {},
    "ret_on_issue_status": {},
    "ret_on_issue_status_unsolicited": {},
}
// Read all files in the directory synchronously

const returnPayload = () => {
    try {
        const files = fs.readdirSync(downloadDirectory);

        // Loop through each file
        files.forEach(file => {
            const filePath = path.join(downloadDirectory, file);
            const fileData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(fileData);
            const fileNameWithoutExt = path.basename(file, path.extname(file));
            payload[fileNameWithoutExt] = jsonData

            if (fileNameWithoutExt.includes("on_status")) {
                let onStatusName = fileNameWithoutExt == "on_status_Order-picked-up" ? "on_status_picked" : fileNameWithoutExt == "on_status_Order-delivered" ? "on_status_delivered" : "on_status_pending"
                payload[onStatusName] = jsonData;
            }

            if (fileNameWithoutExt.includes("search")) {
                let onStatusName = fileNameWithoutExt == "on_search_full_catalog" ? "on_search_full_catalog_refresh" : fileNameWithoutExt == "on_search_inc_catalog_local" ? "on_search_inc_refresh" : fileNameWithoutExt == "search_full_catalog" ? "search_full_catalog_refresh" : "search_inc_refresh"
                payload[onStatusName] = jsonData;

            }

            if (fileNameWithoutExt.includes("issue")) {
                let issue = fileNameWithoutExt == "issue_open_1" ? "on_search_full_catalog_refresh" : fileNameWithoutExt == "on_search_inc_catalog_local" ? "on_search_inc_refresh" : fileNameWithoutExt == "search_full_catalog" ? "search_full_catalog_refresh" : "search_inc_refresh"

            }
        });
        console.log(payload)
        fs.writeFileSync("payload.json", JSON.stringify(payload, null, 2));

        return payload
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

returnPayload()

