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
            if (entry.action == "status") {
                return
            }
            let newFileName = `${entry.action}.json`;
            if (entry.action.includes("search")) {
                newFileName = `${entry.action}_full_catalog.json`;
            }
            // if (entry.action.includes("select")) {
            //     console.log(entry.action)
            //     console.log(entry)
            //     newFileName = index == 0 || index == 1 ? `${entry.action}_(out_of_stock).json` : `${entry.action}.json`;
            //     //     newFileName = `${entry.action}_${index}.json`
            // }

            if (entry.action == "on_status") {
                const lastFullfillment = entry.logs.message.order.fulfillments[0];
                newFileName = `${entry.action}_${lastFullfillment.state.descriptor.code}.json`;
            }

            if (entry.action.includes("update")) {

                if (entry.action == "update" && entry.logs.message.order) {
                    if (entry.logs.message.update_target == "item") {
                        newFileName = `${entry.action}_Part_${entry.logs.message.order.fulfillments[0].type}.json`;
                    }
                    if (entry.logs.message.update_target == "payment") {
                        newFileName = `${entry.action}_settlement.json`;
                    }
                }

                if (entry.action == "on_update") {
                    console.log("On____UPDATE")
                    const lastFullfillment = entry.logs.message.order.fulfillments[entry.logs.message.order.fulfillments.length - 1];

                    newFileName = `${entry.action}_Part_${lastFullfillment.state.descriptor.code}.json`;
                }
            }

            if (entry.action.includes("issue")) {
                newFileName = `${entry.action}_${index + 1}.json`;

                if (entry.action === 'issue') {
                    newFileName = `${entry.action}_${entry.logs.message.issue.status?.toLowerCase()}_${index + 1}.json`;
                }

                if (entry.action === "on_issue_status") {
                    const lastAction = entry.logs.message?.issue.issue_actions.respondent_actions[entry.logs.message?.issue.issue_actions.respondent_actions.length - 1].respondent_action.toLowerCase();
                    if (lastAction) {
                        newFileName = `${entry.action}_${lastAction}_${index + 1}.json`
                    } else {
                        return
                    }


                }


            }
            newFileName = `${index + 1}.${newFileName}`
            const newFilePath = path.join(downloadDirectory, newFileName);

            // Write the prettified JSON content to the new file
            fs.writeFileSync(newFilePath, JSON.stringify(entry.logs, null, 2));

            // Write the entry content to the new file
        });
    } catch (error) {
        console.error(`Error parsing JSON file ${jsonFilePath}: ${error}`);
    }
}

// Example usage: Replace 'your_json_file_path.json' with the path to your JSON file
generateLogs('./logs.json');
