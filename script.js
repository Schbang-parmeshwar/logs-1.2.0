const fs = require('fs');
const path = require('path');
const downloadDirectory = path.join(__dirname, 'Group C', 'Flow 6'); // Replace with your preferred directory structure
if (!fs.existsSync(downloadDirectory)) {
    fs.mkdirSync(downloadDirectory);
}

function generateLogs(jsonFilePath) {
    // Read the JSON content from the file
    try {

        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');

        const entries = JSON.parse(jsonData);

        // Create a new file for each entry
        entries.forEach((entry, index) => {
            let newFileName = `${entry.action}_${index + 1}.json`;
            if (entry.action.includes("select")) {
                newFileName = `${entry.action}_${index}.json`;
            }

            if (entry.action == "on_status") {
                console.log("On___Status", entry.action)
                const lastFullfillment = entry.logs.message.order.fulfillments[entry.logs.message.order.fulfillments.length - 1];
                newFileName = `${entry.action}_${lastFullfillment.state.descriptor.code}.json`;
            }

            if (entry.action.includes("update")) {
                if (entry.action == "update" && entry.logs.message.order) {
                    newFileName = `${entry.action}_Part_${entry.logs.message.order.fulfillments[0].type}.json`;
                }
                if (entry.action == "on_update") {
                    console.log("On____UPDATE")
                    newFileName = `${entry.action}_Part_${entry.logs.message.order.fulfillments[1].state.descriptor.code}.json`;
                }
            }
            const newFilePath = path.join(downloadDirectory, newFileName);

            // Write the prettified JSON content to the new file
            fs.writeFileSync(newFilePath, JSON.stringify(entry.logs, null, 2));

            // Write the entry content to the new file
            console.log(`Created file: ${newFilePath}`);
        });
    } catch (error) {
        console.error(`Error parsing JSON file ${jsonFilePath}: ${error}`);
    }
}

// Example usage: Replace 'your_json_file_path.json' with the path to your JSON file
generateLogs('./logs.json');
