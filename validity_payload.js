const fs = require('fs');
const path = require('path');

const downloadDirectory = path.join(__dirname, 'Group A', 'Flow 3');
let payload = {}
payload = {
    "search_full_catalog_refresh": {},
    "on_search_full_catalog_refresh": {},
    "search_inc_refresh": {},
    "on_search_inc_refresh": {},
    "select_out_of_stock": {},
    "on_select_out_of_stock": {},
    "select": {},
    "on_select": {},
    "init": {},
    "on_init": {},
    "confirm": {},
    "on_confirm": {},
    "on_status_pending": {},
    "on_status_packed": {},
    "on_status_picked": {},
    "on_status_out_for_delivery": {},
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

            if (fileNameWithoutExt.includes("select")) {
                let onStatusName = fileNameWithoutExt == "on_select_(out_of_stock)" ? "on_select_out_of_stock" : fileNameWithoutExt == "select_(out_of_stock)" ? "select_out_of_stock" : fileNameWithoutExt == "select" ? "select" : "on_select"
                payload[onStatusName] = jsonData;
                return

            }
            if (fileNameWithoutExt.includes("on_status")) {
                let onStatusName = fileNameWithoutExt == "on_status_Packed" ? "on_status_packed" : fileNameWithoutExt == "on_status_Order-picked-up" ? "on_status_picked" : fileNameWithoutExt == "on_status_Out-for-delivery" ? "on_status_out_for_delivery" : fileNameWithoutExt == "on_status_Order-delivered" ? "on_status_delivered" : "on_status_pending"
                payload[onStatusName] = jsonData;
                return
            }

            if (fileNameWithoutExt.includes("search")) {
                let onStatusName = fileNameWithoutExt == "on_search_full_catalog" ? "on_search_full_catalog_refresh" : fileNameWithoutExt == "on_search_inc_catalog_local" ? "on_search_inc_refresh" : fileNameWithoutExt == "search_full_catalog" ? "search_full_catalog_refresh" : "search_inc_refresh"
                payload[onStatusName] = jsonData;
                return

            }

            if (fileNameWithoutExt.includes("issue")) {
                let issue = fileNameWithoutExt == "issue_open_1" ? "on_search_full_catalog_refresh" : fileNameWithoutExt == "on_search_inc_catalog_local" ? "on_search_inc_refresh" : fileNameWithoutExt == "search_full_catalog" ? "search_full_catalog_refresh" : "search_inc_refresh"
                return
            }

            payload[fileNameWithoutExt] = jsonData
            console.log(fileNameWithoutExt)

        });
        // console.log(payload)
        fs.writeFileSync("payload.json", JSON.stringify(payload, null, 2));

        return payload
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

returnPayload()

