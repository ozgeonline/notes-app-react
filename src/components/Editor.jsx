import React from "react"
import ReactMde from "react-mde"
import Showdown from "showdown"

export default function Editor({ tempNoteText, setTempNoteText }) {
    const [selectedTab, setSelectedTab] = React.useState("write")

    const converter = new Showdown.Converter({ //Converter, Markdown metnini HTML'ye dönüştürmek için kullanılır.
        tables: true, //Markdown tablolarının HTML tablolarına dönüştürülmesini sağlar.
        simplifiedAutoLink: true, //Markdown metninde URL'lerin otomatik olarak bağlanmasını sağlar.
        strikethrough: true, //Markdown üstü çizili metnin HTML üstü çizili metne dönüştürülmesini sağlar.
        tasklists: true, //Markdown görev listelerinin HTML görev listelerine dönüştürülmesini sağlar.
    })  

    return (
        <section className="pane editor">
            <ReactMde
                value={tempNoteText}
                onChange={setTempNoteText}
                selectedTab={selectedTab} //Markdown düzenleyicisinde o anda seçili olan sekmeye ayarlanır.
                onTabChange={setSelectedTab} //seçilen sekme değiştiğinde çağrılan bir işleve ayarlanır.
                generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown)) }
                //ikinci argüman Promise çözümlendiğinde çağrılan bir fonksiyondur.
                //Markdown metninin önizlemesini oluşturmak için kullanılan bir işleve ayarlanır.
                //converter.makeHtml(), kütüphane tarafından sağlanan bir işlevdir-Showdown.Giriş olarak bir Markdown metni dizesi alır ve bir HTML dizesi döndürür.
                minEditorHeight={80}
                heightUnits="vh"
            />
        </section>
    )
}
