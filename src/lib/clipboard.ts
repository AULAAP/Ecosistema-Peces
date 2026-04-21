
/**
 * Robusta utilidad para copiar al portapapeles con fallback para contextos no seguros o iframes.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error('Clipboard API unavailable');
  } catch (err) {
    // Fallback para contextos no seguros o denegación de permisos en iframes
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Aseguramos que sea seleccionable pero invisible
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999); // Soporte para móviles Apple
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (!successful) {
        throw new Error('Fallback copy command failed');
      }
      return true;
    } catch (fallbackErr) {
      console.warn('Copy automation failed, using manual backup:', fallbackErr);
      // Último recurso: Diálogo manual si todo lo automático falla
      window.prompt("Tu navegador bloqueó la copia automática. Copia este texto manualmente:", text);
      return true;
    }
  }
};
