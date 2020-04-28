module.exports = i => {
    const d = new Date(i)
    const dtf = new Intl.DateTimeFormat('en', { weekday:'long',year: 'numeric', month: 'long', day: 'numeric', hour:'numeric',minute:'2-digit',second:'2-digit' }) 
    const [{ value: we },,{ value: mo },,{ value: da },,{ value: ye },,{ value: ho },,{ value: mi },,{ value: se }] = dtf.formatToParts(d) 
    return `${we} ${mo} ${da}, ${ye} ${ho}:${mi}`;
}