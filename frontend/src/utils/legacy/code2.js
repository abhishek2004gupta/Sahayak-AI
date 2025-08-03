summary = ""
while(1){
    summary += `${prompt} -> ${output},\n`;
}
// for post to summary page
if(old_summary = "") summary_page = run(`Summarize the whole conversation in the given following steps: \n 1. Score level of Stress \n 2. progress seen after completion of session. 3. overall suggestions for the user to make change in thier daily life to be stress free. Keet it simple and short`);
else summary_page = run(`Summarize the whole conversation in the given following steps: \n 1. Score level of Stress \n 2. progress seen after completion of session. 3. overall suggestions for the user to make change in thier daily life to be stress free.\n 4.given old summary ${old_summary}, tell the progress rate of user. keep things simple and short`);
