// ===== Процент внутри одной карточки =====
function updateCardPercent(card) {
    const percentDisplay = card.querySelectorAll('.card-title')[1];

    let total = 0;
    let checked = 0;

    // ===== обычные чекбоксы (не внутри .one)
    const normalCheckboxes = card.querySelectorAll(
        '.checkbox:not(.one .checkbox)'
    );

    total += normalCheckboxes.length;
    checked += [...normalCheckboxes].filter(cb =>
        cb.classList.contains('checked')
    ).length;

    // ===== группы .one (считаются как 1)
    card.querySelectorAll('.one').forEach(one => {
        total += 1;

        if (one.querySelector('.checkbox.checked')) {
            checked += 1;
        }
    });

    const percent = total === 0 ? 0 : ((checked / total) * 100).toFixed(2);
    percentDisplay.textContent = `${percent}%`;
}


// ===== Общий процент в header =====
function updateGlobalPercent() {
    const headerPercent = document.querySelector('header p:last-child');
    const allCheckboxes = document.querySelectorAll('.checkbox');

    const total = allCheckboxes.length;
    const checked = [...allCheckboxes].filter(cb =>
        cb.classList.contains('checked')
    ).length;

    const percent = total === 0 ? 0 : ((checked / total) * 100).toFixed(2);
    headerPercent.textContent = `${percent}%`;
}

// ===== Делегирование кликов =====
document.querySelectorAll('.card').forEach(card => {
    updateCardPercent(card);

    card.addEventListener('click', e => {
        const checkbox = e.target.closest('.checkbox');
        if (!checkbox) return;

        const parentOne = checkbox.closest('.one');

        if (parentOne) {
            if (checkbox.classList.contains('checked')) {
                checkbox.classList.remove('checked');
            } else {
                parentOne
                    .querySelectorAll('.checkbox')
                    .forEach(c => c.classList.remove('checked'));
                checkbox.classList.add('checked');
            }
        } else {
            checkbox.classList.toggle('checked');
        }

        updateCardPercent(card);
        updateGlobalPercent();
    });
});

// ===== Сразу при загрузке =====
updateGlobalPercent();
