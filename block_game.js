document.addEventListener("DOMContentLoaded", function() {
    const gridCells = document.querySelectorAll('.grid-cell');
    const pieceSelector = document.getElementById('piece-selector');
    let draggedPiece = null;

    const availablePieceTemplates = [
        { 
            type: 'single', color: '#00f3ff', 
            offsets: [[0,0]], 
            html: '<div style="width:18px; height:18px; background:#00f3ff; border-radius:4px; box-shadow: inset 0 0 5px rgba(255,255,255,0.6), 0 0 8px #00f3ff;"></div>', 
            style: 'border: 2px solid #00f3ff; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'line2', color: '#ff007f', 
            offsets: [[0,0], [0,1]], 
            html: '<div style="display:flex; gap:2px;"><div style="width:14px; height:16px; background:#ff007f; border-radius:3px;"></div><div style="width:14px; height:16px; background:#ff007f; border-radius:3px;"></div></div>', 
            style: 'border: 2px solid #ff007f; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'line3', color: '#ff5500', 
            offsets: [[0,0], [0,1], [0,2]], 
            html: '<div style="display:flex; gap:2px;"><div style="width:10px; height:16px; background:#ff5500; border-radius:2px;"></div><div style="width:10px; height:16px; background:#ff5500; border-radius:2px;"></div><div style="width:10px; height:16px; background:#ff5500; border-radius:2px;"></div></div>', 
            style: 'border: 2px solid #ff5500; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'line5', color: '#ffff00', 
            offsets: [[0,0], [0,1], [0,2], [0,3], [0,4]], 
            html: '<div style="display:flex; gap:2px;"><div style="width:6px; height:16px; background:#ffff00; border-radius:2px;"></div><div style="width:6px; height:16px; background:#ffff00; border-radius:2px;"></div><div style="width:6px; height:16px; background:#ffff00; border-radius:2px;"></div><div style="width:6px; height:16px; background:#ffff00; border-radius:2px;"></div><div style="width:6px; height:16px; background:#ffff00; border-radius:2px;"></div></div>', 
            style: 'border: 2px solid #ffff00; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'block2x2', color: '#00ff66', 
            offsets: [[0,0], [0,1], [1,0], [1,1]], 
            html: '<div style="display: grid; grid-template-columns: repeat(2, 12px); gap: 2px;"><div style="width:12px; height:12px; background:#00ff66; border-radius:2px;"></div><div style="width:12px; height:12px; background:#00ff66; border-radius:2px;"></div><div style="width:12px; height:12px; background:#00ff66; border-radius:2px;"></div><div style="width:12px; height:12px; background:#00ff66; border-radius:2px;"></div></div>', 
            style: 'border: 2px solid #00ff66; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'block3x3', color: '#9900ff', 
            offsets: [[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]], 
            html: '<div style="display: grid; grid-template-columns: repeat(3, 8px); gap: 2px;"><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div><div style="width:8px; height:8px; background:#9900ff;"></div></div>', 
            style: 'border: 2px solid #9900ff; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'l_shape_right', color: '#00ccff', 
            offsets: [[0,0], [1,0], [2,0], [2,1], [2,2]], 
            html: '<div style="display:flex; flex-direction:column; gap:2px;"><div style="display:flex; gap:2px;"><div style="width:10px; height:10px; background:#00ccff;"></div><div style="width:10px; height:10px;"></div></div><div style="display:flex; gap:2px;"><div style="width:10px; height:10px; background:#00ccff;"></div><div style="width:10px; height:10px;"></div></div><div style="display:flex; gap:2px;"><div style="width:10px; height:10px; background:#00ccff;"></div><div style="width:10px; height:10px; background:#00ccff;"></div></div></div>', 
            style: 'border: 2px solid #00ccff; display: flex; align-items: center; justify-content: center;' 
        },
        { 
            type: 'corner_down', color: '#ff00aa', 
            offsets: [[0,0], [1,0], [1,1]], 
            html: '<div style="display:flex; flex-direction:column; gap:2px;"><div style="display:flex; gap:2px;"><div style="width:12px; height:12px; background:#ff00aa;"></div></div><div style="display:flex; gap:2px;"><div style="width:12px; height:12px; background:#ff00aa;"></div><div style="width:12px; height:12px; background:#ff00aa;"></div></div></div>', 
            style: 'border: 2px solid #ff00aa; display: flex; align-items: center; justify-content: center;' 
        }
    ];

    function getOffsets(pieceType) {
        switch(pieceType) {
            case 'single': return [[0,0]];
            case 'line2': return [[0,0], [0,1]];
            case 'line3': return [[0,0], [0,1], [0,2]];
            case 'line5': return [[0,0], [0,1], [0,2], [0,3], [0,4]];
            case 'block2x2': return [[0,0], [0,1], [1,0], [1,1]];
            case 'block3x3': return [[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]];
            case 'l_shape_right': return [[0,0], [1,0], [2,0], [2,1], [2,2]];
            case 'corner_down': return [[0,0], [1,0], [1,1]];
            default: return [[0,0]];
        }
    }

    function spawnNewPieces() {
        pieceSelector.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            let template = availablePieceTemplates[Math.floor(Math.random() * availablePieceTemplates.length)];
            
            let pieceDiv = document.createElement('div');
            pieceDiv.className = 'draggable-piece';
            pieceDiv.setAttribute('draggable', 'true');
            pieceDiv.setAttribute('data-type', template.type);
            pieceDiv.setAttribute('data-color', template.color);
            pieceDiv.style.cssText = `background: rgba(0,0,0,0.5); padding: 8px; border-radius: 10px; cursor: grab; touch-action: none; ${template.style}`;
            pieceDiv.innerHTML = template.html;

            let dragClone = null;
            let offsetX = 0, offsetY = 0;

            // PC Drag
            pieceDiv.addEventListener('dragstart', function(e) {
                draggedPiece = this;
                let ghost = document.createElement('div');
                ghost.style.opacity = '0';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 0, 0);
                setTimeout(() => ghost.remove(), 0);
                setTimeout(() => this.style.opacity = '0.3', 0);
            });

            pieceDiv.addEventListener('dragend', function() {
                this.style.opacity = '1';
                draggedPiece = null;
                clearHoverEffects();
            });

            // Mobile Touch Drag
            pieceDiv.addEventListener('touchstart', function(e) {
                draggedPiece = this;
                let touch = e.touches[0];
                this.style.opacity = '0.2';

                dragClone = this.cloneNode(true);
                dragClone.style.position = 'fixed';
                dragClone.style.zIndex = '1000';
                dragClone.style.pointerEvents = 'none';
                dragClone.style.opacity = '0.9';
                dragClone.style.transform = 'scale(1.1) translateY(-35px)';
                
                let rect = this.getBoundingClientRect();
                offsetX = touch.clientX - rect.left;
                offsetY = touch.clientY - rect.top;
                
                dragClone.style.left = (touch.clientX - offsetX) + 'px';
                dragClone.style.top = (touch.clientY - offsetY) + 'px';
                document.body.appendChild(dragClone);
            }, { passive: true });

            pieceDiv.addEventListener('touchmove', function(e) {
                if (!draggedPiece || !dragClone) return;
                let touch = e.touches[0];

                dragClone.style.left = (touch.clientX - offsetX) + 'px';
                dragClone.style.top = (touch.clientY - offsetY) + 'px';

                dragClone.style.display = 'none';
                let elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                dragClone.style.display = 'block';

                if (elementBelow) {
                    let cell = elementBelow.closest('.grid-cell');
                    if (cell) {
                        showHoverPreview(cell, draggedPiece);
                    } else {
                        clearHoverEffects();
                    }
                }
            }, { passive: true });

            pieceDiv.addEventListener('touchend', function(e) {
                if (!draggedPiece) return;
                let touch = e.changedTouches[0];

                if (dragClone) dragClone.style.display = 'none';
                let elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

                if (elementBelow) {
                    let cell = elementBelow.closest('.grid-cell');
                    if (cell) {
                        tryPlacePiece(cell, draggedPiece);
                    }
                }

                if (dragClone) {
                    dragClone.remove();
                    dragClone = null;
                }

                this.style.opacity = '1';
                draggedPiece = null;
                clearHoverEffects();
            });

            pieceSelector.appendChild(pieceDiv);
        }
        checkGameOver();
    }

    function showHoverPreview(cell, piece) {
        clearHoverEffects();
        let pieceType = piece.getAttribute('data-type');
        let color = piece.getAttribute('data-color');
        let offsets = getOffsets(pieceType);
        let startRow = parseInt(cell.getAttribute('data-row'));
        let startCol = parseInt(cell.getAttribute('data-col'));

        let canPlace = true;
        let targetCells = [];

        for (let offset of offsets) {
            let r = startRow + offset[0];
            let c = startCol + offset[1];
            if (r > 9 || c > 9) { canPlace = false; break; }

            let targetCell = document.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`);
            if (!targetCell) { canPlace = false; break; }

            let bg = targetCell.style.background;
            let isOccupied = bg && bg !== 'transparent' && !bg.includes('rgba(255, 255, 255, 0.02)') && bg !== '';
            if (isOccupied) { canPlace = false; break; }

            targetCells.push(targetCell);
        }

        targetCells.forEach(tc => {
            if (canPlace) {
                tc.style.background = color;
                tc.style.boxShadow = `inset 0 0 8px ${color}, 0 0 10px ${color}`;
                tc.style.border = `1px solid #fff`;
                tc.classList.add('hover-preview');
            } else {
                tc.style.background = 'rgba(255, 0, 0, 0.2)';
                tc.classList.add('hover-preview');
            }
        });
    }

    function tryPlacePiece(cell, piece) {
        let startRow = parseInt(cell.getAttribute('data-row'));
        let startCol = parseInt(cell.getAttribute('data-col'));
        let pieceType = piece.getAttribute('data-type');
        let color = piece.getAttribute('data-color');
        let offsets = getOffsets(pieceType);

        let targetCells = [];
        let canPlace = true;

        for (let offset of offsets) {
            let r = startRow + offset[0];
            let c = startCol + offset[1];
            if (r > 9 || c > 9) { canPlace = false; break; }

            let targetCell = document.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`);
            if (!targetCell) { canPlace = false; break; }

            let bg = targetCell.style.background;
            let isOccupied = bg && bg !== 'transparent' && !bg.includes('rgba(255, 255, 255, 0.02)') && bg !== '';
            if (isOccupied) { canPlace = false; break; }

            targetCells.push(targetCell);
        }

        if (!canPlace) return;

        targetCells.forEach(tc => {
            tc.style.background = color;
            tc.style.border = '1px solid #ffffff';
            tc.style.boxShadow = `inset 0 0 8px rgba(255,255,255,0.7), 0 0 12px ${color}`;
        });

        piece.remove();
        checkAndClearLines();

        if (pieceSelector.children.length === 0) {
            setTimeout(spawnNewPieces, 250);
        } else {
            checkGameOver();
        }
    }

    function checkAndClearLines() {
        let completedRows = [];
        let completedCols = [];

        for (let r = 0; r < 10; r++) {
            let isRowFull = true;
            for (let c = 0; c < 10; c++) {
                let cell = document.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`);
                let bg = cell.style.background;
                let isOccupied = bg && bg !== 'transparent' && !bg.includes('rgba(255, 255, 255, 0.02)') && bg !== '';
                if (!isOccupied) { isRowFull = false; break; }
            }
            if (isRowFull) completedRows.push(r);
        }

        for (let c = 0; c < 10; c++) {
            let isColFull = true;
            for (let r = 0; r < 10; r++) {
                let cell = document.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`);
                let bg = cell.style.background;
                let isOccupied = bg && bg !== 'transparent' && !bg.includes('rgba(255, 255, 255, 0.02)') && bg !== '';
                if (!isOccupied) { isColFull = false; break; }
            }
            if (isColFull) completedCols.push(c);
        }

        let totalCleared = completedRows.length + completedCols.length;

        if (totalCleared > 0) {
            completedRows.forEach(r => {
                for (let c = 0; c < 10; c++) {
                    resetCell(document.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`));
                }
            });

            completedCols.forEach(c => {
                for (let r = 0; r < 10; r++) {
                    resetCell(document.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`));
                }
            });

            updateScoreOnServer(totalCleared * 150);
        }
    }

    function resetCell(cell) {
        cell.style.background = 'rgba(255,255,255,0.02)';
        cell.style.border = '1px solid var(--border-color, rgba(255,255,255,0.15))';
        cell.style.boxShadow = 'none';
    }

    gridCells.forEach(cell => {
        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
            if (draggedPiece) showHoverPreview(this, draggedPiece);
        });
        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            clearHoverEffects();
            if (draggedPiece) tryPlacePiece(this, draggedPiece);
        });
    });

    function clearHoverEffects() {
        gridCells.forEach(tc => {
            if (tc.classList.contains('hover-preview')) {
                tc.classList.remove('hover-preview');
                let bg = tc.style.boxShadow;
                if (!bg || !bg.includes('12px')) {
                    resetCell(tc);
                }
            }
        });
    }

    function checkGameOver() {
        const currentPieces = pieceSelector.querySelectorAll('.draggable-piece');
        if (currentPieces.length === 0) return;

        let anyMovePossible = false;
        currentPieces.forEach(piece => {
            let offsets = getOffsets(piece.getAttribute('data-type'));
            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 10; c++) {
                    let canFitHere = true;
                    for (let offset of offsets) {
                        let targetR = r + offset[0], targetC = c + offset[1];
                        if (targetR > 9 || targetC > 9) { canFitHere = false; break; }
                        let cell = document.querySelector(`.grid-cell[data-row='${targetR}'][data-col='${targetC}']`);
                        if (!cell) { canFitHere = false; break; }
                        let bg = cell.style.background;
                        if (bg && bg !== 'transparent' && !bg.includes('rgba(255, 255, 255, 0.02)') && bg !== '') {
                            canFitHere = false; break;
                        }
                    }
                    if (canFitHere) { anyMovePossible = true; break; }
                }
                if (anyMovePossible) break;
            }
        });

        if (!anyMovePossible) {
            pieceSelector.innerHTML = '<div style="color: #ff0055; font-weight: bold; font-size: 1.2rem; text-align: center; width: 100%;">GAME OVER</div>';
        }
    }

    function updateScoreOnServer(points) {
        const scoreSpan = document.getElementById('score-display');
        scoreSpan.innerText = parseInt(scoreSpan.innerText) + points;

        let formData = new FormData();
        formData.append('action', 'score_update');
        formData.append('points', points);

        fetch('', { method: 'POST', body: formData }).then(res => res.json()).then(data => {
            if(data.status === 'success') {
                if(data.daily_html) document.getElementById('daily-top-body').innerHTML = data.daily_html;
                if(data.monthly_html) document.getElementById('monthly-top-body').innerHTML = data.monthly_html;
                if(data.yearly_html) document.getElementById('yearly-top-body').innerHTML = data.yearly_html;
            }
        });
    }

    spawnNewPieces();
});
