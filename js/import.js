
// wip, was literally written in 30 minutes because i accidentally cleared the calendar and needed to put my data back in
function loadReclyneData() {
    // Upload reclyne-data file
    let d = document.createElement("input");
    d.setAttribute('type', 'file');
    d.setAttribute('id', 'fileinput');
    document.body.appendChild(d);
    d.addEventListener('change', function() {
        // Get file
        let myFile = $('#fileinput').prop('files')[0];

        let keys = [];
        let datas = [];
        // Read contents of file
        const fr = new FileReader();
        fr.onload = () => {
            // Split file by lines
            let linesO = fr.result.split('\n');
            for (let i = 0; i < linesO.length; i++) {
                // Split lines by delimiter char
                lineParts = linesO[i].split(' § ');
                // Save split lines to keys and datas array
                keys.push(lineParts[0]);
                datas.push(JSON.parse(lineParts[1]));
            }

            // Save data to localstorage
            for (let i = 0; i < keys.length; i++) {
                updateLocalStorage(keys[i], datas[i]);
            }

            // Refresh table
            generateTable(false);
        };
        fr.readAsText(myFile);
        document.body.removeChild(d);
    });
    d.click();
}