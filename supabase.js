// Подключаем Supabase как модуль прямо из CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { updateCardPercent, updateGlobalPercent, initCardClicks } from './gta4.js';

// URL и ключ из твоего проекта
const supabaseUrl = 'https://npsgeavarfmlvckcamkm.supabase.co';
const supabaseKey = 'sb_publishable_Xppq9hMlUHEH9oeGOzpMdA_RogCUft2';

// создаём клиент
export const supabase = createClient(supabaseUrl, supabaseKey);

// проверка
console.log('Supabase подключен через модуль:', supabase);







// Берём все чекбоксы на странице
const checkboxes = document.querySelectorAll('.checkbox');

checkboxes.forEach((cb, index) => {
    cb.id = `id-${index + 1}`; // присваиваем id по порядку
});

// Функция для загрузки состояния из базы
async function loadCheckboxes() {
    const { data } = await supabase.from('gta4').select('*');
    if (!data) return;

    checkboxes.forEach((cb, index) => {
        const id = index + 1;
        const row = data.find(r => r.id === id);

        if (row && row.checkbox) cb.classList.add('checked');
        else cb.classList.remove('checked');
    });

    // ✅ вызываем функции из DOM-кода
    document.querySelectorAll('.card').forEach(card => updateCardPercent(card));
    updateGlobalPercent();

    // ✅ подключаем обработчики кликов
    initCardClicks();
}



// Добавляем клики для обновления базы
checkboxes.forEach((cb, index) => {
    cb.addEventListener('click', async () => {
        cb.classList.toggle('checked'); // переключаем галочку

        const id = index + 1;
        const value = cb.classList.contains('checked');

        const { data, error } = await supabase
            .from('gta4')
            .upsert({ id, checkbox: value }, { onConflict: ['id'] });

        if (error) console.error('Ошибка при клике:', error);
        else console.log('Обновлено в базе при клике:', data);
    });
});

loadCheckboxes();