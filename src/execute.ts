const execute = async (code:string) => {
    const exeRes = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: 'python',
            version: '3.10.0',
            files: [
                {
                    content: code
                }
            ]
        })
    })
    interface RunResult {
        stdout: string;
        stderr: string;
    }

    interface ExecutionResponse {
        run: RunResult;
    }
    const res = (await exeRes.json()) as ExecutionResponse;
    const { stdout, stderr } = res.run;
    /*console.log('Stdout', stdout)
    console.log('Stderr ',stderr)*/
    return stderr?[0,stderr.split('\n').slice(1).join('\n')]:[1,stdout]
}
export default execute