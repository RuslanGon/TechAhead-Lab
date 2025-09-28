document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("tc108-form");
    const saveBtn = document.getElementById("saveBtn");
    const importBtn = document.getElementById("importBtn");
    const fileInput = document.getElementById("fileInput");
  
    // Показ/скрытие блока деталей представителя
    form.elements["hasRepresentative"].forEach(radio => {
      radio.addEventListener("change", () => {
        const repDetails = document.getElementById("repDetails");
        if (form.elements["hasRepresentative"].value === "Yes") {
          repDetails.style.display = "block";
        } else {
          repDetails.style.display = "none";
        }
      });
    });
  
    saveBtn.addEventListener("click", () => {
      const data = {};
      Array.from(form.elements).forEach(el => {
        if (!el.name) return;
        if (el.type === "checkbox") {
          if (!data[el.name]) data[el.name] = [];
          if (el.checked) data[el.name].push(el.value);
        } else if (el.type === "radio") {
          if (el.checked) {
            data[el.name] = el.value;
          }
        } else {
          data[el.name] = el.value;
        }
      });
  
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tc108-data.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  
    importBtn.addEventListener("click", () => {
      fileInput.click();
    });
  
    fileInput.addEventListener("change", event => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        const data = JSON.parse(e.target.result);
        Array.from(form.elements).forEach(el => {
          if (!el.name) return;
          const v = data[el.name];
          if (v === undefined) return;
  
          if (el.type === "checkbox") {
            el.checked = v.includes(el.value);
          } else if (el.type === "radio") {
            el.checked = (el.value === v);
          } else {
            el.value = v;
          }
        });
  
        // Обновить отображение repDetails, если нужно
        const repDetails = document.getElementById("repDetails");
        if (form.elements["hasRepresentative"].value === "Yes") {
          repDetails.style.display = "block";
        } else {
          repDetails.style.display = "none";
        }
      };
      reader.readAsText(file);
    });
  });
  